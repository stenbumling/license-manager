<script lang="ts">
	import { focusTrap } from '$lib/actions/focusTrap';
	import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAlt.svelte';
	import { fade } from 'svelte/transition';
	import PrimaryButton from './buttons/PrimaryButton.svelte';
	import SecondaryButton from './buttons/SecondaryButton.svelte';

	export let warningText = 'Are you sure you want to do this?';
	export let onConfirm: () => void;
	export let onCancel: () => void;
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window" use:focusTrap>
		<div class="modal-header">
			<WarningAltFilled fill="red" size={32} />
			<h2 class="modal-title">{warningText}</h2>
		</div>
		<div class="button-container">
			<SecondaryButton title="Cancel" action={onCancel} />
			<PrimaryButton title="Confirm" action={onConfirm} />
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
		background-color: white;
	}

	.modal-header {
		margin: 0 0 3rem 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
	}

	.modal-title {
		margin: 0;
		text-align: center;
	}

	.button-container {
		display: flex;
		justify-content: space-between;
	}

	h2 {
		margin-bottom: 0.4rem;
	}

	@media (max-width: 1000px) {
		.modal-window {
			width: 80vw;
			padding: 2rem 2rem 2rem 2rem;
		}
	}
</style>
