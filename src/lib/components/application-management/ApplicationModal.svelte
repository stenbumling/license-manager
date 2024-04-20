<script>
	import { focusTrap } from '$lib/actions/focusTrap';
	import CloseModalButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { applicationModalMode, modal } from '$lib/stores/modal-store';
	import { applicationStore } from '$lib/stores/resources/application-store';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import ApplicationAdd from './ApplicationAdd.svelte';
	import ApplicationEdit from './ApplicationEdit.svelte';
	import ApplicationList from './ApplicationList.svelte';

	onMount(async () => {
		await applicationStore.fetch();
	});
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window" use:focusTrap>
		<div class="modal-header">
			<h1 class="modal-title">Application<br />management</h1>
			<CloseModalButton action={modal.closeApplication} />
		</div>
		{#if $applicationModalMode === 'list'}
			<div class="modal-content" in:fly={{ duration: 200, x: -50, easing: quintOut }}>
				<ApplicationList />
			</div>
		{:else if $applicationModalMode === 'add'}
			<div class="modal-content" in:fly={{ duration: 200, x: 50, easing: quintOut }}>
				<ApplicationAdd />
			</div>
		{:else if $applicationModalMode === 'edit'}
			<div class="modal-content" in:fly={{ duration: 200, x: 50, easing: quintOut }}>
				<ApplicationEdit />
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
		background-color: white;
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
