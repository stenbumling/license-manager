<script lang="ts">
	import { fade } from 'svelte/transition';
	import ButtonCancel from './buttons/ButtonCancel.svelte';
	import ButtonLarge from './buttons/ButtonLarge.svelte';

	export let warningText = 'Are you sure you want to do this?';
	export let onConfirm: () => void;
	export let onCancel: () => void;
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<div class="modal-header">
			<h3 class="modal-title">{warningText}</h3>
		</div>
		<div class="button-container">
			<ButtonCancel action={onCancel} />
			<ButtonLarge title="Confirm" action={onConfirm} />
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
		padding: 3rem 4rem 2rem 4rem;
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
		text-align: center;
	}

	.button-container {
		display: flex;
		justify-content: space-between;
	}

	h3 {
		margin-bottom: 0.4rem;
	}
</style>
