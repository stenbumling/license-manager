<script lang="ts">
	import LicenseViewContainer from '$lib/components/license/LicenseViewContainer.svelte';
</script>

<div class="main-container">
	<LicenseViewContainer />
</div>

<style>
	.main-container {
		width: 100%;
		max-width: 116rem;
		padding: 3rem 4.9rem 0 5.1rem;
		display: flex;
		flex-direction: row;
	}

	@media (max-height: 850px) {
		.main-container {
			padding: 1rem 3rem;
		}
	}
</style>
