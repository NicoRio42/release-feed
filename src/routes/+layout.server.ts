export async function load({ locals }) {
	const user = locals.user;

	return {
		userId: user?.id ?? null,
		userName: user?.username ?? null
	};
}
