<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { licenseStore } from '$lib/stores/license-store.ts';
	import { Circle } from 'svelte-loading-spinners';
	import { fade, slide } from 'svelte/transition';

	let pending: any;
</script>

<div class="table-body-wrapper">
	{#await pending}
		<div class="fallback-container" in:fade={{ duration: 500 }}>
			<Circle color="var(--deep-purple)" />
		</div>
	{:then}
		{#if $licenseStore.length === 0}
			<div class="fallback-container">
				<h1>No licenses found</h1>
			</div>
		{:else}
			<div role="rowgroup">
				{#each $licenseStore as license, index}
					<div transition:slide|global={{ duration: 160 }}>
						<LicenseRow {license} {index} />
					</div>
				{/each}
			</div>
		{/if}
	{:catch}
		<div class="fallback-container">
			<h1>I AM ERROR</h1>
		</div>
	{/await}
</div>

<style>
	.table-body-wrapper {
		border-bottom: 2px solid black;
		border-top: 2px solid black;
		flex-grow: 1;
		overflow-y: scroll;
	}

	.fallback-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
