import { auth, githubAuth } from '$lib/server/auth.js';
import { db } from '$lib/server/db.js';
import { accessTokenTable, userTable } from '$lib/server/schema.js';
import { OAuth2RequestError } from 'arctic';
import { and, eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export const GET = async ({ url, cookies, locals }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { accessToken } = await githubAuth.validateAuthorizationCode(code);

		console.log(accessToken);

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		console.log(githubUserResponse.status, githubUserResponse.statusText);

		const githubUser: GitHubUser = await githubUserResponse.json();

		const getUser = async () => {
			const existingUser = await db
				.select()
				.from(userTable)
				.where(eq(userTable.githubId, githubUser.id))
				.get();

			if (existingUser) return existingUser;

			const userId = generateId(15);

			await db
				.insert(userTable)
				.values({
					id: userId,
					githubId: githubUser.id,
					username: githubUser.login,
					profile: 'simple',
					registrationDate: new Date()
				})
				.run();

			return (await db.select().from(userTable).where(eq(userTable.id, userId)).get())!;
		};

		const user = await getUser();

		await db
			.delete(accessTokenTable)
			.where(and(eq(accessTokenTable.userId, user.id), eq(accessTokenTable.provider, 'github')))
			.run();

		await db
			.insert(accessTokenTable)
			.values({ userId: user.id, provider: 'github', token: accessToken })
			.run();

		const session = await auth.createSession(user.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/feed'
			}
		});
	} catch (e) {
		console.error(e);

		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};

interface GitHubUser {
	id: string;
	login: string;
}
