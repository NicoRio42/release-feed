import { db } from '$lib/server/db.js';
import { accessTokenTable, repositoryTable } from '$lib/server/schema.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Release } from './release.model.js';

export async function load({ locals }) {
	if (locals.user === null) throw redirect(302, '/login');

	const [[accessToken], repositories] = await db.batch([
		db
			.select()
			.from(accessTokenTable)
			.where(
				and(eq(accessTokenTable.userId, locals.user.id), eq(accessTokenTable.provider, 'github'))
			),
		db.select().from(repositoryTable).where(eq(repositoryTable.fkUser, locals.user.id))
	]);

	if (accessToken === undefined) throw redirect(302, '/login');

	if (repositories.length === 0) {
		return { releases: [] };
	}

	const query = `
fragment repoProperties on Repository {
	nameWithOwner
	owner {
		avatarUrl
	}
    latestRelease {
        id
        name
        url
    }
}

{
  ${repositories
		.map(
			(
				{ owner, name },
				index
			) => `repo${index + 1}: repository(owner: "${owner}", name: "${name}") {
    ...repoProperties
  }`
		)
		.join('\n')}
}`;

	let response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.token}`
		},
		body: JSON.stringify({
			query
		})
	});

	if (response.status === 401) throw redirect(302, '/login/github');

	let releasesResponse: graphqlResponse = await response.json();

	const repositoriesWithReleases = Object.values(releasesResponse.data).map((repoFromGraphQL) => {
		const [owner, name] = repoFromGraphQL.nameWithOwner.split('/');
		const repoFromDatabase = repositories.find(
			(repo) => repo.name === name && repo.owner === owner
		);
		if (repoFromDatabase === undefined) throw error(500);

		return {
			...repoFromGraphQL.latestRelease,
			repoName: repoFromGraphQL.nameWithOwner,
			ownerAvatarUrl: repoFromGraphQL.owner.avatarUrl
		};
	});

	return {
		releases: repositoriesWithReleases
	};
}

type graphqlResponse = {
	data: Record<
		string,
		{
			nameWithOwner: string;
			owner: { avatarUrl: string };
			latestRelease: Omit<Release, 'repoName'>;
		}
	>;
};

export const actions = {
	default: async ({ locals, request }) => {
		if (locals.user === null) throw redirect(302, '/login');

		const formData = await request.formData();
		const repositoryUrl = formData.get('repository-url');

		if (typeof repositoryUrl !== 'string') return fail(400);

		let url: URL;

		try {
			url = new URL(repositoryUrl);
		} catch (e) {
			console.error(e);
			return fail(400);
		}

		if (url.host !== 'github.com') return fail(400);

		const [_, owner, name] = url.pathname.split('/');

		const accessToken = await db
			.select()
			.from(accessTokenTable)
			.where(
				and(eq(accessTokenTable.userId, locals.user.id), eq(accessTokenTable.provider, 'github'))
			)
			.get();

		if (accessToken === undefined) throw redirect(302, '/login');

		const repoPing = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken.token}`
			}
		});

		if (!repoPing.ok) return fail(404);

		const existingRepo = await db
			.select()
			.from(repositoryTable)
			.where(
				and(
					eq(repositoryTable.fkUser, locals.user.id),
					eq(repositoryTable.owner, owner),
					eq(repositoryTable.name, name)
				)
			)
			.get();

		if (existingRepo !== undefined) return fail(400);

		await db.insert(repositoryTable).values({ fkUser: locals.user.id, owner, name }).run();
	}
};
