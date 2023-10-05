<script>
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.js';
	import { fade } from 'svelte/transition';

	function goBack() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="modal-container" transition:fade={{ duration:120 }}>
	<dialog open class="modal-window">
		<h1>Add new license</h1>
		<!--TODO: Remove link when replaced by a close button-->
		<a href="/" on:click|preventDefault={goBack}>Go back</a>
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
		border: none;
		display: flex;
		align-self: center;
		width: 70vw;
		height: 75vh;
		background-color: white;
		padding: 20px;
	}
</style>
