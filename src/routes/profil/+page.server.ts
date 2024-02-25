import { auth } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) redirect(302, '/');

	return { userName: locals.user.username };
}

export const actions = {
	logout: async ({ locals, cookies }) => {
		if (!locals.session) return fail(401);
		await auth.invalidateSession(locals.session.id);
		const sessionCookie = auth.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login');
	}
};
