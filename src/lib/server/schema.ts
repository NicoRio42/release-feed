import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { generateId } from 'lucia';

const id = text('id')
	.primaryKey()
	.notNull()
	.$defaultFn(() => generateId(15));

export const userTable = sqliteTable('user', {
	id,
	username: text('username').notNull(),
	githubId: text('github_id'),
	profile: text('profile', { enum: ['simple', 'paying_basic', 'paying_premium'] })
		.default('simple')
		.notNull(),
	registrationDate: integer('registration_date', { mode: 'timestamp' }).notNull()
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable('user_session', {
	id,
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull()
});

export const accessTokenTable = sqliteTable(
	'access_token',
	{
		id,
		provider: text('provider', { enum: ['github'] }).notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		token: text('token').notNull()
	},
	(t) => ({
		unique: unique().on(t.userId, t.provider)
	})
);

export const repositoryTable = sqliteTable('repository', {
	id,
	fkUser: text('fk_user')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	owner: text('owner').notNull(),
	name: text('name').notNull(),
	latestSeenRelease: text('latest_seen_release')
});
