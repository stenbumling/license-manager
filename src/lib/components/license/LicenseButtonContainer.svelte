<script lang="ts">
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.ts';

	function goBack() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="button-container">
	<a href="/" class="button" on:click={goBack}>
		<h3>Add new license</h3>
	</a>
</div>

<style>
	.button-container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		grid-column: 1 / -1;
	}

	.button {
		cursor: pointer;
		display: flex;
		align-items: center;
		background-color: black;
		color: white;
		height: 3rem;
		width: 16rem;
		box-sizing: border-box;
		margin-top: 1.5rem;
		padding: 1rem 1.3rem;
		text-decoration: none;
	}

	a:hover {
		background-color: var(--deep-purple);
	}

	h3 {
		margin-top: 2px;
	}
</style>
