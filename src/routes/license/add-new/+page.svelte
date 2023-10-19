<script lang="ts">
	import LicenseView from '$lib/components/license/NewLicenseContainer.svelte';
</script>

<div class="main-container">
	<LicenseView />
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		max-width: 116rem;
		padding: 3rem 4.9rem 0 5.1rem;
	}

	@media (max-height: 850px) {
		.main-container {
			padding: 1rem 3rem;
		}
	}
</style>
