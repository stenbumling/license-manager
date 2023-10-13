<script lang="ts">
	import { goto } from '$app/navigation';
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import LicenseServiceField from '$lib/components/license/fields/LicenseServiceField.svelte';
	import LicenseTextField from '$lib/components/license/fields/LicenseTextField.svelte';
	import LicenseTitle from '$lib/components/license/fields/LicenseTitle.svelte';
	import ServiceModal from '$lib/components/ServiceModal.svelte';
	import { showModal, showServiceModal } from '$lib/stores/modal.ts';

	function handleClick() {
		goto('/');
		showModal.set(false);
	}
</script>

{#if $showServiceModal}
<ServiceModal />
{/if}

<div class="license-container">
	<LicenseTitle/>
	<div class="fields-grid">
		<LicenseServiceField/>
		<LicenseTextField label="Assigned users" />
		<LicenseTextField label="Status"/>
		<LicenseTextField label="License category"/>
		<LicenseTextField label="Contact person"/>
		<LicenseTextField label="Renewal date"/>
		<LicenseTextField label="Link to license site"/>
		<LicenseTextField label="Comment"/>
		<LicenseTextField label="Renewal interval"/>
		<LicenseTextField label="Something else"/>
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
		justify-content: space-between;
	}

	.fields-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 2rem 5rem;
		width: 100%;
		max-width: 100rem;
		height: calc(100% - 12rem);
		overflow-y: auto;
	}

	.buttons-container {
		display: flex;
		width: 100%;
		align-items: center;
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
