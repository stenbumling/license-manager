<script lang="ts">
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.ts';

	function goBack() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="title-container">
	<h1>Title</h1>
	<a href="/" on:click|preventDefault={goBack}>Go back</a>
</div>

<style>
	.title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		grid-column: 1 / -1;
	}
</style>
