import { githubAuth } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';

export const GET = async ({ cookies, locals }) => {
	const state = generateState();
	const url = await githubAuth.createAuthorizationURL(state, { scopes: ['read:user'] });

	cookies.set('github_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
};
