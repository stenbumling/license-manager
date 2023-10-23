<script lang="ts">
	import { goto } from '$app/navigation';
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import ApplicationModal from '$lib/components/license/application-admin/ApplicationModal.svelte';
	import ApplicationSelection from '$lib/components/license/fields/ApplicationSelection.svelte';
	import ExpirationField from '$lib/components/license/fields/ExpirationField.svelte';
	import LicenseTitle from '$lib/components/license/fields/LicenseTitle.svelte';
	import SelectField from '$lib/components/license/fields/SelectField.svelte';
	import TextAreaField from '$lib/components/license/fields/TextAreaField.svelte';
	import TextField from '$lib/components/license/fields/TextField.svelte';
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
		<ApplicationSelection />
		<TextField bind:value={license.assignedUsers} label="Assigned users" required />
		<SelectField
			bind:value={license.status}
			label="Status"
			options={['Active', 'Inactive', 'Expired']}
			required
			defaultOption="Active"
		/>
		<SelectField
			bind:value={license.category}
			label="Category"
			options={['Development', 'Media', 'Project Management', 'Educational', 'Uncategorized']}
			defaultOption="Uncategorized"
		><TextField slot="hehe" label="Other information" type="secondary"/></SelectField>
		<TextField bind:value={license.contactInformation} label="Contact person">
			<TextField slot="hehe" label="Other information" type="secondary"/>
		</TextField>
		<ExpirationField bind:value={license.renewalDate} />
		<TextField bind:value={license.link} label="Link to license site" />
		<TextAreaField bind:value={license.comment} label="Comment" />
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
