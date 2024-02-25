<script>
	import { fade } from 'svelte/transition';
</script>

<main
	in:fade
	class="fixed top-50% left-50% -translate-x-50% -translate-y-50% flex flex-col items-center gap-4 w-100% px-4"
>
	<h1 class="text-center">The perfect shovel for the Saas gold rush</h1>

	<div class="flex justify-center gap-4">
		<a role="button" class="outline" href="about">Learn more</a>

		<a role="button" class="text-nowrap" href="/app">Start shoveling</a>
	</div>
</main>
