<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import { applicationStore } from '$lib/stores/application-store';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import '../app.postcss';

	applicationStore.set($page.data.applicationList);
</script>

<header>
	<Header />
</header>
<main>
	<slot />
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		min-height: calc(100vh - 4.65rem);
	}

	@media (max-height: 850px) {
		main {
			min-height: calc(100vh - 3.3rem);
		}
	}
</style>
