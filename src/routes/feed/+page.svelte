<script>
	import { enhance } from '$app/forms';

	export let data;

	const newReleases = data.releases.filter((r) => r.name !== r.latestSeenRelease);
	const oldReleases = data.releases.filter((r) => r.name === r.latestSeenRelease);
</script>

<main class="mx-auto max-w-120 py px2">
	<form method="post" use:enhance>
		<fieldset role="group">
			<input type="url" name="repository-url" />

			<button type="submit" class="text-nowrap">Add repo</button>
		</fieldset>
	</form>

	{#if newReleases.length !== 0}
		<h2>New releases</h2>
	{/if}

	<ul class="pl0">
		{#each newReleases as release (release.id)}
			<li class="list-none flex gap1 items-center">
				<img
					src={release.ownerAvatarUrl}
					alt="Avatar for github user {release.repoName.split('/')[0]}"
					class="w12 h12 rounded-full"
					width="460"
					height="460"
				/>

				<a
					href="/feed/{release.repoName}?url={encodeURI(release.url)}&release-name={release.name}"
					class="flex justify-between grow"
				>
					<span>{release.repoName}</span>
					<span>{release.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	{#if oldReleases.length !== 0}
		<h2>Previously seen</h2>
	{/if}

	<ul class="pl0">
		{#each oldReleases as release (release.id)}
			<li class="list-none">
				<img
					src={release.ownerAvatarUrl}
					alt="Avatar for github user {release.repoName.split('/')[0]}"
					class="w12 h12 rounded-full"
				/>

				<a href={release.url}>{release.repoName} {release.name}</a>
			</li>
		{/each}
	</ul>
</main>
