<script>
	import { focusTrap } from '$lib/actions/focusTrap';
	import ApplicationAddPage from '$lib/components/application-management/ApplicationAddPage.svelte';
	import ApplicationEditPage from '$lib/components/application-management/ApplicationEditPage.svelte';
	import ApplicationListPage from '$lib/components/application-management/ApplicationListPage.svelte';
	import CloseButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { applicationModalView, modal } from '$lib/stores/modal-store';
	import { quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window" use:focusTrap>
		<div class="modal-header">
			<h1 class="modal-title">Application<br />management</h1>
			<CloseButton action={modal.closeApplication} />
		</div>
		{#if $applicationModalView === 'list'}
			<div class="modal-content" in:fly={{ duration: 200, x: -50, easing: quintOut }}>
				<ApplicationListPage />
			</div>
		{:else if $applicationModalView === 'add'}
			<div class="modal-content" in:fly={{ duration: 200, x: 50, easing: quintOut }}>
				<ApplicationAddPage />
			</div>
		{:else if $applicationModalView === 'edit'}
			<div class="modal-content" in:fly={{ duration: 200, x: 50, easing: quintOut }}>
				<ApplicationEditPage />
			</div>
		{/if}
	</dialog>
</div>

<style>
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
	}

	.modal-window {
		width: 40vw;
		max-width: 30rem;
		padding: 3rem 4rem;
		border: none;
		display: flex;
		flex-direction: column;
		align-self: center;
		background-color: var(--color-white);
	}

	@media (max-width: 800px) {
		.modal-window {
			width: 80vw;
			max-width: 100vw;
		}
	}

	.modal-header {
		margin: 0 0 3rem 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.modal-title {
		margin: 0;
		font-size: 2rem;
	}

	.modal-content {
		display: flex;
		min-height: 50vh;
		height: 50vh;
		max-height: 50vh;
		flex-direction: column;
	}
</style>
