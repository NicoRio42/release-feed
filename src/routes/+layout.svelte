<script lang="ts">
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import './pico-custom.css';
	import 'uno.css';

	export let data;
</script>

<nav class="container-fluid border-b-2 border-b-solid border-b-[var(--table-border-color)]">
	<ul>
		<li class="text-6 font-600">
			<a href="/">Shovel JS</a>
		</li>
	</ul>

	<ul>
		<li><a href="/pricing">Pricing</a></li>

		{#if data.userId}
			<li><a href="/app">App</a></li>

			<li>
				<a href="/profil" class="flex gap-2 items-center">
					<i class="i-carbon-user-avatar block w-5 h-5" />

					{data.userName}</a
				>
			</li>
		{:else}
			<li><a href="/login">Login</a></li>
			<li><a role="button" href="/signup">Sign up</a></li>
		{/if}

		<li>
			<ThemeSwitch />
		</li>
	</ul>
</nav>

<slot />
