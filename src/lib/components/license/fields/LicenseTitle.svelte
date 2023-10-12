<script lang="ts">
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.ts';

	function handleClick() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="title-container">
	<h1>AutoCAD</h1>
	<a href="/" on:click|preventDefault={handleClick}>Go back</a>
</div>

<style>
	.title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		grid-column: 1 / -1;
	}
</style>
