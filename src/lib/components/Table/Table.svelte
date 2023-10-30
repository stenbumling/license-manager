<script lang="ts">
	import { goto } from '$app/navigation';
	import LicensRow from '$lib/components/table/LicenseRow.svelte';
	import type { License } from '$lib/stores/license-store';
	import { licenseStore } from '$lib/stores/license-store';

	function handleClick(license: License, e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		goto(`/?modal=edit&id=${license.id}`);
	}
</script>

<tbody class="table">
	{#each $licenseStore as license}
		<a
			class="license-row"
			href={`/license/view/${license.id}`}
			on:click={(e) => handleClick(license, e)}
		>
			<LicensRow {license} />
		</a>
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

	.license-row:hover {
		background-color: #eeeeee;
		cursor: pointer;
	}
</style>
