<script lang="ts">
	import { page } from '$app/stores';
	import LicenseContainer from '$lib/components/license/LicenseContainer.svelte';
</script>

<div class="main-container">
	<LicenseContainer />
</div>

<style>
	.main-container {
		width: 100%;
		max-width: 116rem;
		padding: 3rem 4.9rem 0 5.1rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	@media (max-height: 850px) {
		.main-container {
			padding: 1rem 3rem;
		}
	}
</style>
