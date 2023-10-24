<script lang="ts">
	import ApplicationItem from '$lib/components/application-management/ApplicationItem.svelte';
	import { application, applicationStore } from '$lib/stores/application-store';
	import { showApplicationModal } from '$lib/stores/modal-state';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import { fade } from 'svelte/transition';

	function handleAdd() {
		applicationStore.add($application);
		applicationStore.reset();
	}

	function handleClose() {
		showApplicationModal.set(false);
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<div class="modal-header">
			<h1 class="modal-title">Application<br />management</h1>
			<a href="/" class="close-button" on:click|preventDefault={handleClose}>
				<CloseLarge size={24} aria-label="CloseLarge" />
			</a>
		</div>
		<h3>Add new application</h3>
		<div class="input-container">
			<input bind:value={$application.name} type="text" placeholder="Application name" required />
			<button class="add-button" on:click={handleAdd}>
				<Add size={32} fill="white" aria-label="Add" />
			</button>
		</div>
		<h3>List of applications</h3>
		<div class="application-list">
			{#each $applicationStore as application}
				<ApplicationItem {application} />
			{/each}
		</div>
	</dialog>
</div>

<style>
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
	}

	.modal-window {
		width: 40vw;
		max-width: 30rem;
		max-height: 60vh;
		padding: 3rem 4rem;
		border: none;
		display: flex;
		flex-direction: column;
		align-self: center;
		background-color: white;
	}

	.modal-header {
		margin: 0 0 3rem 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.modal-title {
		margin: 0;
		font-size: 2rem;
	}

	.close-button {
		padding: 0.2rem;
		display: flex;
		border-radius: 6px;
		color: black;
		transition: color 0.25s ease;
		transition: background-color 0.2s ease;
		text-decoration: none;
		font-size: 1rem;
		&:hover {
			background-color: #eeeeee;
		}

		&:active {
			position: relative;
			top: 1px;
			left: 1px;
		}
	}

	.input-container {
		width: 100%;
		margin-bottom: 3rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.add-button {
		height: 2.2rem;
		aspect-ratio: 1/1;
		margin-left: 1.6rem;
		border-radius: 6px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
		cursor: pointer;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: var(--deep-purple);
		}

		&:active {
			position: relative;
			top: 1px;
			left: 1px;
		}
	}

	.application-list {
		overflow-y: auto;
		padding-right: 2.8rem;
	}

	h3 {
		margin-bottom: 0.4rem;
	}

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		width: 100%;
		height: 3rem;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		background-color: transparent;
	}

	input:hover {
		padding-left: 0.6rem;
		border: 1px dashed black;
	}

	input:focus {
		padding-left: 0.6rem;
		border: 2px solid var(--light-purple);
		outline: none;
	}
</style>
