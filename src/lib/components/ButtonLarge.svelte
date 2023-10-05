<script>
	import { goto } from '$app/navigation';
	import ModalContainer from '$lib/components/modal/ModalContainer.svelte';
	import { showModal } from '$lib/stores/modal.js';

	function addNewLicense() {
		goto('/?add-new-license');
		showModal.set(true);
	}
</script>

{#if $showModal}
	<ModalContainer />
{/if}

<a href="/add-new-license" class="button" on:click|preventDefault={addNewLicense}>
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
