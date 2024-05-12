<script lang="ts">
	import CloseButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { modal, warningModal } from '$lib/stores/modal-store';
	import { currentLicense, fetchedLicense, licenseMode } from '$lib/stores/resources/license-store';
	import { getDateWithHoursAndMinutes } from '$lib/utils/date-utils';

	if ($licenseMode === 'add') {
		fetchedLicense.set(JSON.parse(JSON.stringify($currentLicense)));
	}

	function handleCloseModal() {
		if (JSON.stringify($currentLicense) === JSON.stringify($fetchedLicense)) {
			modal.closeLicense();
		} else {
			warningModal.set('unsaved-license-changes');
		}
	}
</script>

<div class="header-container">
	<div class="header">
		{#if $licenseMode === 'view' && $currentLicense.updatedAt}
			<span class="updated-info"
				>Last updated at {getDateWithHoursAndMinutes($currentLicense.updatedAt)}</span
			>
		{/if}
		<div class="close-button">
			<CloseButton action={handleCloseModal} />
		</div>
	</div>
	{#if $currentLicense.application.name && $licenseMode === 'view'}
		<h1 class="title">{$currentLicense.application.name}</h1>
	{:else}
		<h1 class="title new-license">New license</h1>
	{/if}
</div>

<style>
	.header-container {
		border-bottom: 1px solid var(--text-placeholder);
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.4rem;
	}

	.updated-info {
		color: var(--text-placeholder);
		font-size: 0.8rem;
	}

	.close-button {
		margin-left: auto;
	}

	.title {
		margin-bottom: 1rem;
		margin-top: 0rem;
		font-size: 2.8rem;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 90%;
	}

	.new-license {
		color: var(--text-placeholder);
	}
</style>
