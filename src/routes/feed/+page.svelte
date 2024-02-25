<script>
	import { enhance } from '$app/forms';

	export let data;
</script>

<main class="mx-auto max-w-120">
	<h1>Feed</h1>

	<form method="post" use:enhance>
		<fieldset role="group">
			<input type="url" name="repository-url" />

			<button type="submit" class="text-nowrap">Add repo</button>
		</fieldset>
	</form>

	{#each data.releases as release (release.id)}
		<p>
			<a href={release.url}>{release.repoName} {release.name}</a>
		</p>
	{/each}
</main>
