<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import '../app.postcss';
</script>

<header>
	<Header />
</header>

<main>
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 4.65rem);
		display: flex;
		justify-content: center;
	}

	@media (max-height: 850px) {
		main {
			min-height: calc(100vh - 3.3rem);
		}
	}
</style>
