<script lang="ts">
	import LicensRow from '$lib/components/table/LicenseRow.svelte';
	import { licenseStore } from '$lib/stores/license-store';
</script>

<tbody class="table">
	{#each $licenseStore as license}
		<LicensRow {license} />
	{/each}
</tbody>

<style>
	.table {
		min-height: 30.4rem;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow-y: auto;
		scrollbar-gutter: stable both-edges;
	}

	.table > :global(:last-child) {
		border-bottom: none;
	}
</style>
