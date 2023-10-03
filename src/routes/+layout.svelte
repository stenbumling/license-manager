<script>
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import Header from '../components/Header.svelte';
</script>

<header>
	<Header />
</header>
<main>
	<div class="main-container">
		<slot />
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		padding: 5rem 3rem 1.4rem 3rem;
	}

	.main-container {
		width: 100%;
		max-width: 120rem;
		display: flex;
		flex-direction: column;
	}
</style>
