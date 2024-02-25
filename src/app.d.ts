import type * as schema from '$lib/server/schema.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { type Client } from '@libsql/client/web';
import type { GitHub } from 'arctic';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
	}
}

declare module '$env/static/private' {
	export const TURSO_DB_URL: string;
	export const TURSO_DB_TOKEN: string;
	export const GITHUB_CLIENT_ID: string;
	export const GITHUB_CLIENT_SECRET: string;
}

export {};
