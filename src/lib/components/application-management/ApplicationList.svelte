<script>
	import { scrollShadow } from '$lib/actions/scrollShadow';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import { applicationModalMode } from '$lib/stores/modal-store';
	import { applicationFetchRequest } from '$lib/stores/request-state-store';
	import { applicationStore } from '$lib/stores/resources/application-store';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import ApplicationItem from './ApplicationListItem.svelte';
</script>

<div class="application-list-container">
	<h3 style="margin-bottom:0.5rem;">List of applications</h3>

	<!-- Loading -->
	{#if $applicationFetchRequest.isLoading}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<Circle color="var(--deep-purple)" />
		</div>

		<!-- Errors and no results -->
	{:else if $applicationFetchRequest.error.message}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<h2>{$applicationFetchRequest.error.message}</h2>
		</div>
	{:else if $applicationStore.length === 0}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<h2>No applications added yet</h2>
		</div>
	{:else}
		<!-- Render application items -->
		<div class="application-list" use:scrollShadow in:fade={{ duration: 200 }}>
			{#each $applicationStore as application}
				<ApplicationItem {application} />
			{/each}
		</div>
	{/if}
	<div class="button-container">
		<PrimaryButton title="Add new application" action={() => applicationModalMode.set('add')} />
	</div>
</div>

<style>
	.application-list-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-height: inherit;
	}

	.application-list {
		overflow-y: auto;
		margin-bottom: 2rem;
	}

	.fallback-container {
		width: 100%;
		height: 100%;
		min-height: 16rem;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
	}

	h2,
	h3 {
		margin-bottom: 0.4rem;
		max-width: 80%;
	}
</style>
