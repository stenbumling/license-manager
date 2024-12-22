<script lang="ts">
	import { focusTrap } from '$lib/actions/focusTrap';
	import LicenseContainer from '$lib/components/license-management/LicenseContainer.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window" use:focusTrap>
		<LicenseContainer />
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
		width: 80vw;
		max-width: 100rem;
		height: 86vh;
		padding: 2rem 4rem;
		border: none;
		display: flex;
		align-self: center;
		background-color: var(--color-white);
	}
</style>
