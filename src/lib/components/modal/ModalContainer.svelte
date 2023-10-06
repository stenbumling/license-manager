<script lang="ts">
	import LicenseView from '$lib/components/modal/LicenseView.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<LicenseView />
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
		width: 80vw;
		max-width: 120rem;
		height: 78vh;
		background-color: white;
		padding: 2rem 4rem;
	}

	@media (max-width: 1000px) {
		.modal-window {
			width: 50vh;
		}
	}
</style>
