<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/license/Modal.svelte';
	import { showModal } from '$lib/stores/modal.ts';

	function handleClick(e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}

		e.preventDefault();
		goto('/?modal=add-new');
		showModal.set(true);
	}
</script>

{#if $showModal}
	<Modal />
{/if}

<a href="/add-new" class="button" on:click={handleClick}>
	<h3>Add new license</h3>
</a>

<style>
	.button {
		cursor: pointer;
		display: flex;
		align-items: center;
		background-color: black;
		color: white;
		height: 3rem;
		width: 100%;
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
