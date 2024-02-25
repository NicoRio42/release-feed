<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<main class="container">
	<h1>Profile</h1>

	<p>Name: {data.userName}</p>

	<form action="?/logout" method="post" use:enhance>
		<button type="submit">Sign out</button>
	</form>
</main>
