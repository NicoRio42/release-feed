import { db } from '$lib/server/db.js';
import { repositoryTable } from '$lib/server/schema.js';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function GET({ locals, params, url }) {
	if (locals.user === null) throw redirect(302, '/login/github');
	const releaseUrl = url.searchParams.get('url');
	const releaseName = url.searchParams.get('release-name');
	if (releaseUrl === null || releaseName === null) throw error(400);

	const toto = await db
		.update(repositoryTable)
		.set({ latestSeenRelease: releaseName })
		.where(
			and(
				eq(repositoryTable.name, params.name),
				eq(repositoryTable.owner, params.owner),
				eq(repositoryTable.fkUser, locals.user.id)
			)
		)
		.returning();

	throw redirect(302, decodeURI(releaseUrl));
}
