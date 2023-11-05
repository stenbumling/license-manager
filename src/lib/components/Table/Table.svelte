<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { licenseStore } from '$lib/stores/license-store';
	import { onMount } from 'svelte';

	let hoveredRowId: string | null = null;
	let tableElement: HTMLElement | null = null;
	let tableRect = {
		top: 0,
		bottom: 0,
	};

	// (Re)calculates the table position in viewport when the table is resized
	// This is needed to calculate where the context menu should be rendered
	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const rect = entry.target.getBoundingClientRect();
				tableRect.top = rect.top;
				tableRect.bottom = rect.bottom;
			}
		});

		if (tableElement) {
			resizeObserver.observe(tableElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	});

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

<tbody class="table" bind:this={tableElement}>
	{#each $licenseStore as license}
		<div class="license-row" class:hovered={hoveredRowId === license.id}>
			<LicenseRow {license} bind:tableRect on:hover={(event) => handleHover(event, license.id)} />
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
