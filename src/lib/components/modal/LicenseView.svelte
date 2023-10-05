<script lang="ts">
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.ts';

	function goBack() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="view-container">
	<div>
		<h1>Add new license</h1>
		<a href="/" on:click|preventDefault={goBack}>Go back</a>
	</div>
</div>

<style>
	/* .view-container {
		border: 1px solid black;
		height: 3rem;
		display: flex;
		justify-content: space-between;
		width: 100%;
		max-width: 120rem;
		height: 100%;
	} */
</style>
