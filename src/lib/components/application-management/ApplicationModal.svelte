<script lang="ts">
	import { scrollShadow } from '$lib/actions/scrollShadow';
	import ButtonSmall from '$lib/components/misc/buttons/ButtonSmall.svelte';
	import CloseModalButton from '$lib/components/misc/buttons/CloseModalButton.svelte';
	import { application, applicationStore } from '$lib/stores/application-store';
	import { applicationFetchRequest } from '$lib/stores/request-state-store';
	import { modal } from '$lib/stores/modal-store';
	import {
		applicationValidationError,
		validateApplication,
	} from '$lib/validations/application-validation';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import { onMount } from 'svelte';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import ApplicationItem from './ApplicationItem.svelte';

	onMount(() => {
		applicationStore.fetch();
	});

	async function handleAdd(e?: MouseEvent | KeyboardEvent) {
		if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
		const isValid = await validateApplication($application);
		if (isValid) {
			applicationStore.add($application);
			applicationStore.reset();
		} else {
			return;
		}
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<div class="modal-header">
			<h1 class="modal-title">Application<br />management</h1>
			<CloseModalButton action={modal.closeApplication} />
		</div>
		<h3>Add new application</h3>
		<div class="input-container">
			<input
				bind:value={$application.name}
				type="text"
				placeholder="Application name"
				required
				on:keyup={handleAdd}
			/>
			<ButtonSmall icon={Add} iconSize={32} action={handleAdd} />
		</div>
		<p class="warning-text">
			{#if $applicationValidationError.name}
				<span transition:fade={{ duration: 120 }}>{$applicationValidationError.name}</span>
			{/if}
		</p>
		<h3>List of applications</h3>
		{#if $applicationFetchRequest.isLoading}
			<div class="fallback-container" in:fade={{ duration: 300 }}>
				<Circle color="var(--deep-purple)" />
			</div>
		{:else if $applicationFetchRequest.error}
			<div class="fallback-container" in:fade={{ duration: 300 }}>
				<h3>{$applicationFetchRequest.error}</h3>
			</div>
		{:else if $applicationStore.length === 0}
			<div class="fallback-container" in:fade={{ duration: 300 }}>
				<h3>No applications added yet</h3>
			</div>
		{:else}
			<div class="application-list" use:scrollShadow in:fade={{ duration: 200 }}>
				{#each $applicationStore as application}
					<ApplicationItem {application} />
				{/each}
			</div>
		{/if}
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
		max-height: 70vh;
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

	.warning-text {
		font-size: 0.75rem;
		color: red;
		height: 2.8rem;
		margin-left: 1px;
		margin-bottom: 2rem;
	}

	.input-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.application-list {
		overflow-y: auto;
		padding-right: 2.8rem;
	}

	.fallback-container {
		width: 100%;
		height: 100%;
		min-height: 16rem;
		display: flex;
		justify-content: center;
		align-items: center;
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
		margin-right: 1.4rem;
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
