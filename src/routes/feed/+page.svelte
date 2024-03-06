<script>
	import { enhance } from '$app/forms';

	export let data;

	const newReleases = data.releases.filter((r) => r.name !== r.latestSeenRelease);
	const oldReleases = data.releases.filter((r) => r.name === r.latestSeenRelease);
</script>

<div class="main-wrapper">
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
					<label class="release-checkbox">
						<img
							src={release.ownerAvatarUrl}
							alt="Avatar for github user {release.repoName.split('/')[0]}"
							class="w12 h12 rounded-full"
							width="460"
							height="460"
						/>

						<div
							class="w12 h12 border-solid border-2 border-[var(--pico-primary)] rounded-full flex items-center justify-center checkmark-wrapper"
						>
							<i class="i-carbon-checkmark checkmark w8 h8 text-[var(--pico-primary)]"></i>
						</div>

						<input type="checkbox" name="id" value={release.id} class="hidden" />
					</label>

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
				<li class="list-none flex gap1 items-center">
					<label class="release-checkbox">
						<img
							src={release.ownerAvatarUrl}
							alt="Avatar for github user {release.repoName.split('/')[0]}"
							class="w12 h12 rounded-full"
							width="460"
							height="460"
						/>

						<div
							class="w12 h12 border-solid border-2 border-[var(--pico-primary)] rounded-full flex items-center justify-center checkmark-wrapper"
						>
							<i class="i-carbon-checkmark checkmark w8 h8 text-[var(--pico-primary)]"></i>
						</div>

						<input
							type="checkbox"
							name="id"
							value={release.id}
							form="batch-action-form"
							class="hidden"
						/>
					</label>

					<a href={release.url}>{release.repoName} {release.name}</a>
				</li>
			{/each}
		</ul>
	</main>

	<article class="fixed top-50% right-0 options-modal">
		<form method="get" id="batch-action-form">
			<button type="submit" class="outlined" formaction="?/delete">Delete</button>

			<button type="submit" class="outlined" formaction="?/markAsSeen">Mark as seen</button>

			<input type="reset" />
		</form>
	</article>
</div>

<style>
	.checkmark-wrapper,
	.checkmark {
		display: none;
	}

	.main-wrapper:has(input:checked) img {
		display: none;
	}

	.main-wrapper:has(input:checked) .checkmark-wrapper {
		display: flex;
	}

	.release-checkbox:has(input:checked) .checkmark-wrapper {
		border-width: 3px;
	}

	.release-checkbox:has(input:checked) .checkmark {
		display: block;
	}

	.options-modal {
		transform: translateX(100%);
		transition: transform 0.25s;
	}

	.main-wrapper:has(input:checked) .options-modal {
		transform: translateX(-2rem);
		transition: transform 0.25s;
	}
</style>
