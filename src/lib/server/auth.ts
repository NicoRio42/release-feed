import { dev } from '$app/environment';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { Lucia } from 'lucia';
import { db } from './db.js';
import { sessionTable, userTable, type User } from './schema.js';
import { GitHub } from 'arctic';
import { GITHUB_CLIENT_ID } from '$env/static/private';
import { GITHUB_CLIENT_SECRET } from '$env/static/private';

const adapter = new DrizzleSQLiteAdapter(
	db as unknown as BaseSQLiteDatabase<any, any>,
	sessionTable,
	userTable
);

export const auth = new Lucia(adapter, {
	sessionCookie: { attributes: { secure: !dev } },
	getUserAttributes: (attributes) => ({
		id: attributes.id,
		username: attributes.username,
		githubId: attributes.githubId,
		profile: attributes.profile,
		registrationDate: attributes.registrationDate
	})
});

export const githubAuth = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, {
	redirectURI: 'https://release-feed.pages.dev/login/github/callback'
});

declare module 'lucia' {
	interface Register {
		Lucia: Auth;
		DatabaseUserAttributes: User;
	}
}

type Auth = typeof auth;
