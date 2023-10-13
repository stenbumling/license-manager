<script lang="ts">
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.ts';

	function handleClick() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="title-container">
	<div class="top-container">
		<h3 class="id-label">#838</h3>
		<a href="/" on:click|preventDefault={handleClick}>Go back</a>
	</div>
	<h1 class="title-label">AutoCAD</h1>
</div>

<style>
	.title-container {
		display: flex;
		flex-direction: column;
		grid-column: 1 / -1;
		border-bottom: 1px solid black;
		margin-bottom: 3rem;
	}

	.top-container {
		display: flex;
		justify-content: space-between;
	}

	.title-label {
		font-size: 2.4rem;
		font-weight: 500;
		margin: 0 0 1rem 0;
	}

	.id-label {
		font-size: 1rem;
		margin: 0 0 0.8rem 0;
	}
</style>
