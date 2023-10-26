<script lang="ts">
	import { goto } from '$app/navigation';
	import { license, licenseStore } from '$lib/stores/license-store';
	import { showLicenseModal } from '$lib/stores/modal-state';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';

	function handleClose() {
		showLicenseModal.set(false);
		goto('/');
		licenseStore.reset();
	}
</script>

<div class="header-container">
	<div class="top-container">
		<a href="/" class="close-button" on:click|preventDefault={handleClose}>
			<CloseLarge size={24} aria-label="CloseLarge" />
		</a>
	</div>
	{#if $license.application}
		<h1 class="title-label">{$license.application}</h1>
	{:else}
		<h1 class="new-license-label">New license</h1>
	{/if}
</div>

<style>
	.header-container {
		margin-bottom: 4rem;
		border-bottom: 1px solid var(--text-placeholder);
		display: flex;
		flex-direction: column;
		grid-column: 1 / -1;
		cursor: default;
	}

	.top-container {
		margin: 0 0 0.4rem 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.close-button {
		padding: 0.2rem;
		border-radius: 6px;
		display: flex;
		align-self: center;
		font-size: 1rem;
		text-decoration: none;
		color: black;
		transition: color 0.25s ease;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #eeeeee;
		}

		&:active {
			position: relative;
			top: 1px;
			left: 1px;
		}
	}

	.title-label {
		margin: 0 0 1rem 0;
		font-size: 2.8rem;
		font-weight: 500;
	}

	.new-license-label {
		margin: 0 0 1rem 0;
		font-size: 2.8rem;
		font-weight: 500;
		color: var(--text-placeholder);
	}
</style>
