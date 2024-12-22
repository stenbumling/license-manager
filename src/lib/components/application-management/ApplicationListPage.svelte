<script>
	import { scrollShadow } from '$lib/actions/scrollShadow';
	import ApplicationListItem from '$lib/components/application-management/ApplicationListItem.svelte';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import { applicationModalView } from '$lib/stores/modal-store';
	import { applicationFetchRequest } from '$lib/stores/request-state-store';
	import { applicationStore } from '$lib/stores/resources/application-store';
	import { Circle } from 'svelte-loading-spinners';
	import { fade, slide } from 'svelte/transition';

	$: hasStartedRequest = $applicationFetchRequest.pendingRequests > 0 && !isLoading;
	$: isLoading = $applicationFetchRequest.isLoading;
	$: hasError = $applicationFetchRequest.error?.message;
	$: noResults = $applicationStore.length === 0;
	$: hasApplications = $applicationStore.length > 0;
</script>

<div class="application-list-container">
	<h2>List of applications</h2>

	<!-- Loading -->
	{#if hasStartedRequest}
		<div class="fallback-container" in:fade={{ duration: 120 }}>
			<!-- This div prevents default state being active if loading spinner has a delay -->
		</div>
	{:else if isLoading}
		<div class="fallback-container" in:fade={{ duration: 120 }}>
			<Circle color="var(--color-deep-purple)" />
		</div>

		<!-- Errors and no results -->
	{:else if hasError}
		<div class="fallback-container" in:fade={{ duration: 120 }}>
			<h2>{$applicationFetchRequest.error?.message}</h2>
		</div>
	{:else if noResults}
		<div class="fallback-container" in:fade={{ duration: 120 }}>
			<h3>No applications added yet</h3>
		</div>
	{/if}

	<!-- Render application items -->
	{#if hasApplications && !hasError && !isLoading && !hasStartedRequest}
		<div class="application-list" use:scrollShadow>
			{#each $applicationStore as applicationItem}
				<div transition:slide={{ duration: 120 }}>
					<ApplicationListItem {applicationItem} />
				</div>
			{/each}
		</div>
	{/if}

	<div class="button-container">
		<PrimaryButton title="Add new application" action={() => applicationModalView.set('add')} />
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
		margin: 1rem 0 2rem 0;
		border-top: 1px solid #e6e6e6;
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
