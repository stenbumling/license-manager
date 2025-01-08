<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import NotificationsContainer from '$lib/components/misc/NotificationsContainer.svelte';
	import WarningModal from '$lib/components/misc/WarningModal.svelte';
	import { modal, warningModal } from '$lib/stores/modal-store';
	import { network } from '$lib/stores/network-store';
	import {
		applicationDeleteRequest,
		licenseDeleteRequest,
		licensePostRequest,
	} from '$lib/stores/request-state-store';
	import { applicationStore, applicationToDelete } from '$lib/stores/resources/application-store';
	import {
		currentLicense,
		licenseStore,
		licenseToDelete,
	} from '$lib/stores/resources/license-store';
	import { table } from '$lib/stores/resources/table-store';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import { validateLicense } from '$lib/validations/license-validation';
	import { onMount } from 'svelte';

	onMount(async () => {
		await modal.handleBrowserHistoryChange();
	});
</script>

<AppHeader />
<main>
	<slot />
</main>

<!-- Global event listeners -->
<svelte:window
	on:popstate={async () => await modal.handleBrowserHistoryChange()}
	on:offline={network.handleOffline}
	on:online={network.handleOnline}
/>

<!-- Warning modals -->
{#if $warningModal === 'license-deletion'}
	<WarningModal
		warningText="Warning! This will delete the license and all its data. Are you sure?"
		onConfirm={() => licenseStore.delete($licenseToDelete)}
		requestState={licenseDeleteRequest}
	/>
{:else if $warningModal === 'license-deactivation'}
	<WarningModal
		warningText="This will mark the license as inactive. Are you sure?"
		onConfirm={async () => {
			$currentLicense.status = 'Inactive';
			const isValid = await validateLicense($currentLicense);
			if (isValid) {
				let success = await licenseStore.updateLicense($currentLicense);
				if (success) {
					modal.closeLicense();
					table.updateState();
					licenseStore.updateCounts();
				}
			}
		}}
		requestState={licensePostRequest}
	/>
{:else if $warningModal === 'unsaved-license-changes'}
	<WarningModal
		warningText="Unsaved changes will be lost. Are you sure you want to close the license?"
		onConfirm={() => modal.closeLicense()}
	/>
{:else if $warningModal === 'application-deletion'}
	<WarningModal
		warningText="Warning! This will delete the application. Are you sure?"
		onConfirm={() => applicationStore.delete($applicationToDelete)}
		requestState={applicationDeleteRequest}
	/>
{/if}

<!-- Notifications container -->
<NotificationsContainer />

<style>
	main {
		max-height: calc(100vh - 4.65rem);
		display: flex;
		justify-content: center;
	}

	@media (max-height: 850px) {
		main {
			max-height: calc(100vh - 3.3rem);
		}
	}
</style>
