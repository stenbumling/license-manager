<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
</script>

<header>
	<Header />
</header>

<main>
	<slot />
</main>

<style>
	main {
		max-height: calc(100vh - 4.65rem);
		display: flex;
		justify-content: center;
	}

	@media (max-height: 850px) {
		main {
			max-height: calc(100vh - 3.3rem);
		}
	}
</style>
