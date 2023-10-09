<script lang="ts">
	import LicenseTitle from '$lib/components/license/LicenseTitle.svelte';
	import LicenseField from '$lib/components/license/LicenseField.svelte';
	import LicenseButtonContainer from '$lib/components/license/LicenseButtonContainer.svelte';
</script>

<div class="license-container">
	<LicenseTitle />
	<div class="fields-grid">
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
		<LicenseField />
	</div>
	<LicenseButtonContainer />
</div>

<style>
	.license-container {
		width: 100%;
		max-width: 120rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.fields-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		justify-content: flex-end;
		width: 100%;
		max-width: 120rem;
		height: calc(100% - 12rem);
		overflow-y: auto;
		/* border: 1px solid red; */
	}

	@media (max-width: 1600px) {
		.fields-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
