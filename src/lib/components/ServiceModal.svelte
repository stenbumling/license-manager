<script lang="ts">
	import { showServiceModal } from '$lib/stores/modal.ts';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import { fade } from 'svelte/transition';

	function handleClick() {
		showServiceModal.set(false);
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<a href="/" class="back-link" on:click|preventDefault={handleClick}>
			<CloseLarge size={24} aria-label="CloseLarge" />
		</a>
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
		justify-content: flex-end;
		width: 40vw;
		max-width: 100rem;
		height: 60vh;
		background-color: white;
		padding: 2rem 4rem;
	}

	.back-link {
		font-size: 1rem;
		text-decoration: none;
		color: black;
		transition: color 0.25s ease;
		display: flex;
		align-self: flex-start;
		padding: 0.2rem;
		border-radius: 6px;

		&:hover {
			background-color: #eeeeee;
		}

		&:active {
			position: relative;
			top: 1px;
			left: 1px;
		}
	}
</style>
