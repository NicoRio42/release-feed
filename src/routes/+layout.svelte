<script lang="ts">
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import './pico-custom.css';
	import 'uno.css';
</script>

<nav class="container-fluid border-b-2 border-b-solid border-b-[var(--table-border-color)]">
	<ul>
		<li class="text-6 font-600">
			<a href="/">Release feed</a>
		</li>
	</ul>

	<ul>
		<li>
			<ThemeSwitch />
		</li>
	</ul>
</nav>

<slot />
