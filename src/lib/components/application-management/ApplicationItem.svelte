<script lang="ts">
	import type { Application } from '$lib/stores/application-store';
	import { applicationStore } from '$lib/stores/application-store';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import WarningModal from '../misc/WarningModal.svelte';

	export let application: Application;
	let showWarningModal = false;

	function handleWarningModal() {
		showWarningModal = true;
	}

	function handleDelete() {
		applicationStore.delete(application.id);
		showWarningModal = false;
	}
</script>

<div class="application-item">
	{#if application.licenseAssociations > 0}
		<button class="trashcan-icon">
			<TrashCan size={24} fill="#cccccc" />
		</button>
	{:else}
		<button class="trashcan-icon deletable" on:click={handleWarningModal}>
			<TrashCan size={24} fill="red" />
		</button>
	{/if}
	<p class="application-name">{application.name}</p>
</div>

{#if showWarningModal}
	<WarningModal
		warningText="Are you sure you want to delete this application?"
		onConfirm={handleDelete}
		onCancel={() => (showWarningModal = false)}
	/>
{/if}

<style>
	.application-item {
		width: 100%;
		height: 4rem;
		margin: 0 0 0.2rem 0;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		align-items: center;
	}

	.trashcan-icon {
		position: relative;
		top: -1px;
		width: 2.2rem;
		min-width: 2.2rem;
		height: 2rem;
		margin-right: 1rem;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 0.2s ease;
	}

	.deletable:hover {
		cursor: pointer;
		background-color: #ffefef;
	}

	.application-name {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
