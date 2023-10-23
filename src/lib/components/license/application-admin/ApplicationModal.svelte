<script lang="ts">
	import ApplicationItem from '$lib/components/license/application-admin/ApplicationItem.svelte';
	import { applicationStore, application } from '$lib/stores/application-store';
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
			<a href="/" class="back-link" on:click|preventDefault={handleClose}>
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
		border: none;
		display: flex;
		flex-direction: column;
		align-self: center;
		width: 40vw;
		max-width: 30rem;
		max-height: 60vh;
		background-color: white;
		padding: 3rem 4rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin: 0 0 3rem 0;
	}

	.modal-title {
		font-size: 2rem;
		margin: 0;
	}

	.back-link {
		font-size: 1rem;
		text-decoration: none;
		color: black;
		transition: color 0.25s ease;
		display: flex;
		padding: 0.2rem;
		border-radius: 6px;
		transition: background-color 0.2s ease;
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
		margin-bottom: 3rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		width: 100%;
	}

	.add-button {
		height: 2.2rem;
		aspect-ratio: 1/1;
		border-radius: 6px;
		background-color: black;
		margin-left: 1.6rem;
		cursor: pointer;
		display: flex;
		/* align-self: flex-end; */
		justify-content: center;
		align-items: center;
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

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
	}

	h3 {
		margin-bottom: 0.4rem;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 0.6rem;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 0.6rem;
	}
</style>
