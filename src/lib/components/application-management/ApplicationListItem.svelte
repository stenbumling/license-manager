<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { applicationModalView, warningModal } from '$lib/stores/modal-store';
	import { isOnline } from '$lib/stores/network-store';
	import { applicationToDelete, currentApplication } from '$lib/stores/resources/application-store';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import type { ApplicationData } from '$lib/types/application-types';
	import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { slide } from 'svelte/transition';

	export let applicationItem: ApplicationData;
	let trashcanTooltip = '';
	let isTrashcanDisabled = false;

	$: {
		if (!$isOnline) {
			trashcanTooltip =
				"You're currently offline and cannot delete applications. Try again when you're online";
			isTrashcanDisabled = true;
		} else if (applicationItem.licenseAssociations > 0) {
			trashcanTooltip = `${applicationItem.name} has ${applicationItem.licenseAssociations} license(s) associated with it and cannot be deleted. Delete the associated licenses before trying to delete the application`;
			isTrashcanDisabled = true;
		} else if (applicationItem.name === $currentLicense.application.name) {
			trashcanTooltip = `${applicationItem.name} is currently selected and cannot be deleted. Try unselecting it before deleting`;
			isTrashcanDisabled = true;
		} else {
			trashcanTooltip = '';
			isTrashcanDisabled = false;
		}
	}

	function handleEdit() {
		const appCopy: ApplicationData = JSON.parse(JSON.stringify(applicationItem));
		currentApplication.set(appCopy);
		applicationModalView.set('edit');
	}

	async function handleDeletionWarningModal() {
		if (isTrashcanDisabled) return;
		applicationToDelete.set(applicationItem.id);
		warningModal.set('application-deletion');
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
			<Settings size={24} fill="black" />
		</button>
		<button
			class="trashcan-icon"
			class:deletable={!isTrashcanDisabled}
			use:tooltip={{
				content: trashcanTooltip,
				options: { delay: [500, 0], offset: [0, 10] },
			}}
			on:click={handleDeletionWarningModal}
		>
			<TrashCan size={24} fill={isTrashcanDisabled ? '#cccccc' : 'red'} />
		</button>
	</div>
</div>

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
