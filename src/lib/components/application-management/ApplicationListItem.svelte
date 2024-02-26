<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { applicationModalMode } from '$lib/stores/modal-store';
	import type { Application } from '$lib/stores/resources/application-store';
	import { application, applicationStore } from '$lib/stores/resources/application-store';
	import { license } from '$lib/stores/resources/license-store';
	import SettingsEdit from 'carbon-icons-svelte/lib/Settings.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { slide } from 'svelte/transition';
	import WarningModal from '../misc/WarningModal.svelte';

	export let applicationItem: Application;
	let showWarningModal = false;

	function handleWarningModal() {
		showWarningModal = true;
	}

	function handleEdit() {
		const appCopy = JSON.parse(JSON.stringify(applicationItem));
		application.set(appCopy);
		applicationModalMode.set('edit');
	}

	async function handleDelete() {
		await applicationStore.delete(applicationItem.id);
		showWarningModal = false;
	}
</script>

<div class="application-item" transition:slide={{ duration: 300 }}>
	<p
		class="application-name"
		use:tooltip={{
			content: `${applicationItem.name}`,
			options: { delay: [500, 0], offset: [0, 10] },
		}}
	>
		{applicationItem.name}
	</p>
	<div class="button-container">
		<button class="edit-icon" on:click={handleEdit}>
			<SettingsEdit size={24} fill="black" />
		</button>
		{#if applicationItem.licenseAssociations > 0}
			<button
				class="trashcan-icon"
				use:tooltip={{
					content: `${applicationItem.name} has ${applicationItem.licenseAssociations} license(s) associated with it and can therefore not be deleted. Delete the associated licenses before trying to delete the application`,
					options: { delay: [500, 0], offset: [0, 10] },
				}}
			>
				<TrashCan size={24} fill="#cccccc" />
			</button>
		{:else if applicationItem.name === $license.application.name}
			<button
				class="trashcan-icon"
				use:tooltip={{
					content: `${applicationItem.name} is currently selected and cannot be deleted. Try unselecting it before deleting`,
					options: { delay: [500, 0], offset: [0, 10] },
				}}
			>
				<TrashCan size={24} fill="#cccccc" />
			</button>
		{:else}
			<button class="trashcan-icon deletable" on:click={handleWarningModal}>
				<TrashCan size={24} fill="red" />
			</button>
		{/if}
	</div>
</div>

{#if showWarningModal}
	<WarningModal
		warningText="Warning! This will delete the application. Are you sure?"
		onConfirm={handleDelete}
		onCancel={() => (showWarningModal = false)}
	/>
{/if}

<style>
	.application-item {
		width: calc(100% - 0.2rem);
		padding: 0 0.2rem 0 0;
		height: 4rem;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.application-name {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.button-container {
		display: flex;
		gap: 0.2rem;
		align-items: center;
		justify-content: center;
		margin: 0 0 0 3rem;
		& > * {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 2rem;
			width: 2rem;
			transition: background-color 0.2s ease;
			border-radius: 8px;
		}
	}

	.deletable:hover {
		cursor: pointer;
		background-color: #ffefef;
	}

	.edit-icon:hover {
		cursor: pointer;
		background-color: #f0f0f0;
		& > * {
			transform: rotate(25deg);
			transition: all 0.1s ease-in-out;
		}
	}
</style>
