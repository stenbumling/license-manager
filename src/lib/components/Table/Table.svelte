<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { licenseStore } from '$lib/stores/license-store';

	let hoveredRowId: string | null = null;

	// Decides which row should create a hovered effect, based on license ID
	function handleHover(e: CustomEvent<any>, licenseId: string) {
		if (e.detail.hovered) {
			hoveredRowId = licenseId;
		} else {
			if (hoveredRowId === licenseId) {
				hoveredRowId = null;
			}
		}
	}
</script>

<tbody class="table">
	{#each $licenseStore as license}
		<div class="license-row" class:hovered={hoveredRowId === license.id}>
			<LicenseRow {license} on:hover={(event) => handleHover(event, license.id)} />
		</div>
	{/each}
</tbody>

<style>
	.table {
		min-height: 30.4rem;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow-y: scroll;
	}

	.license-row {
		transition: background-color 0.1s ease;
	}

	.license-row:nth-child(even) {
		background-color: #f9f9f9;
	}

	.license-row.hovered {
		background-color: #eeeeee;
		transition: background-color 0.1s ease;
		cursor: pointer;
	}
</style>
