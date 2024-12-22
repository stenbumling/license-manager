<script lang="ts">
	import { focusTrap } from '$lib/actions/focusTrap';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/misc/buttons/SecondaryButton.svelte';
	import { warningModal } from '$lib/stores/modal-store';
	import { getRequestStateDefaultValues } from '$lib/stores/request-state-store';
	import type { RequestState } from '$lib/types/misc-types';
	import WarningAlt from 'carbon-icons-svelte/lib/WarningAlt.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	export let warningText = 'Are you sure you want to do this?';
	export let onConfirm: () => Promise<void> | void;
	export let onCancel: () => void = () => warningModal.set('closed');
	export let requestState: Writable<RequestState> = writable<RequestState>(
		getRequestStateDefaultValues(),
	);

	async function handleConfirm() {
		await onConfirm();
		warningModal.set('closed');
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window" use:focusTrap>
		<div class="modal-header">
			<WarningAlt fill="red" size={32} />
			<h2 class="modal-title">{warningText}</h2>
		</div>
		<div class="button-container">
			<SecondaryButton title="Cancel" action={onCancel} />
			<PrimaryButton
				title="Confirm"
				action={handleConfirm}
				pendingRequest={$requestState.isLoading}
			/>
		</div>
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
		max-width: 26rem;
		max-height: 60vh;
		padding: 3rem 4rem 3rem 4rem;
		border: none;
		display: flex;
		flex-direction: column;
		align-self: center;
		background-color: var(--color-white);
	}

	.modal-header {
		margin: 0 0 3rem 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
	}

	.modal-title {
		text-align: center;
	}

	.button-container {
		display: flex;
		flex-grow: 2;
		width: 100%;
		gap: 2rem;
	}

	.button-container > :global(*) {
		flex-grow: 1;
		width: 50%;
	}

	@media (max-width: 1000px) {
		.modal-window {
			width: 80vw;
			padding: 2rem 2rem 2rem 2rem;
		}
	}
</style>
