<script lang="ts">
	import { showServiceModal } from '$lib/stores/modal.ts';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import { fade } from 'svelte/transition';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';

	function handleClick() {
		showServiceModal.set(false);
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<div class="modal-header">
			<h1 class="modal-title">Service admin</h1>
			<a href="/" class="back-link" on:click|preventDefault={handleClick}>
				<CloseLarge size={24} aria-label="CloseLarge" />
			</a>
		</div>
		<div class="input-container">
			<input type="text" placeholder="Enter some text" required />
			<button class="settings-button" on:click={handleClick}>
				<Add size={32} fill="white" aria-label="SettingsAdjust" />
			</button>
		</div>
		<div>List</div>
		<div>Confirmation buttons</div>
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
		flex-direction: column;
		align-self: center;
		width: 40vw;
		max-width: 100rem;
		height: 60vh;
		background-color: white;
		padding: 2rem 4rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 0 2rem 0;
	}

	.modal-title {
		font-size: 2rem;
		margin: 0;
	}

	.back-link {
		font-size: 1rem;
		text-decoration: none;
		color: black;
		transition: color 0.25s ease;
		display: flex;
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

	.input-container {
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		width: 100%;
	}

	.settings-button {
		height: 2.2rem;
		aspect-ratio: 1/1;
		border-radius: 6px;
		background-color: black;
		margin-left: 1.6rem;
		cursor: pointer;
		display: flex;
		/* align-self: flex-end; */
		justify-content: center;
		align-items: center;

		&:hover {
			background-color: var(--deep-purple);
		}

		&:active {
			position: relative;
			top: 1px;
			left: 1px;
		}
	}

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 0.3rem;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 0.3rem;
	}
</style>
