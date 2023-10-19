<script lang="ts">
	import { goto } from '$app/navigation';
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import ApplicationModal from '$lib/components/license/application-admin/ApplicationModal.svelte';
	import LicenseApplicationField from '$lib/components/license/fields/LicenseApplicationField.svelte';
	import LicenseTextAreaField from '$lib/components/license/fields/LicenseTextAreaField.svelte';
	import LicenseTextField from '$lib/components/license/fields/LicenseTextField.svelte';
	import LicenseTitle from '$lib/components/license/fields/LicenseTitle.svelte';
	import { showApplicationModal, showModal } from '$lib/stores/modal.ts';

	function handleClick() {
		goto('/');
		showModal.set(false);
	}

	// Initial license values
	let license = {
		application: '',
		assignedUsers: '',
		status: '',
		category: '',
		contactInformation: '',
		renewalDate: '',
		link: '',
		comment: '',
	};
</script>

{#if $showApplicationModal}
	<ApplicationModal />
{/if}

<div class="license-container">
	<LicenseTitle />
	<div class="fields-grid">
		<LicenseApplicationField />
		<LicenseTextField bind:value={license.assignedUsers} label="Assigned users" required />
		<LicenseTextField bind:value={license.status} label="Status" />
		<LicenseTextField bind:value={license.category} label="License category" />
		<LicenseTextField bind:value={license.contactInformation} label="Contact person" />
		<LicenseTextField
			bind:value={license.renewalDate}
			label="Renewal date"
			placeholder="Custom placeholder text"
			secondaryText="Test text"
		/>
		<LicenseTextField bind:value={license.link} label="Link to license site" />
		<LicenseTextAreaField bind:value={license.comment} label="Comment" />
	</div>
	<div class="buttons-container">
		<a href="/" class="link-container" on:click={handleClick}>
			<ButtonLarge title="Save license" />
		</a>
	</div>
</div>

<style>
	.license-container {
		width: 100%;
		max-width: 100rem;
		display: flex;
		flex-direction: column;
	}

	.fields-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: min-content;
		gap: 2rem 5rem;
		width: 100%;
		max-width: 100rem;
		height: auto;
		overflow-y: auto;
		margin-bottom: 3rem;
		padding: 0 1rem 0 0;
	}

	.buttons-container {
		display: flex;
		width: 100%;
		align-items: center;
		margin-top: auto;
		justify-content: flex-end;
	}
	.link-container {
		width: 16rem;
	}

	@media (max-width: 1400px) {
		.fields-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
