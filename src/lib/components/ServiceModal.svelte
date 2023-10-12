<script lang="ts">
	import { fade } from 'svelte/transition';
  import { showServiceModal } from '$lib/stores/modal.ts';

  function handleClick() {
		showServiceModal.set(false);
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<a href="/" on:click|preventDefault={handleClick}>Go back</a>
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
		width: 40vw;
		max-width: 100rem;
		height: 60vh;
		background-color: white;
		padding: 2rem 4rem;
	}
</style>
