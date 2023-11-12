<script lang="ts">
	import { goto } from '$app/navigation';
	import { license, licenseMode, licenseStore } from '$lib/stores/license-store';
	import { showLicenseModal } from '$lib/stores/modal-state';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';

	function closeLicenseModal() {
		showLicenseModal.set(false);
		licenseStore.resetFields();
		goto('/');
	}
</script>

<div class="header-container">
	<div class="header-content">
		{#if $license.application.name && $licenseMode === 'edit'}
			<h1 class="title">{$license.application.name}</h1>
		{:else}
			<h1 class="title new-license">New license</h1>
		{/if}
		<a href="/" class="close-button" on:click|preventDefault={closeLicenseModal}>
			<CloseLarge size={24} aria-label="Close" />
		</a>
	</div>
</div>

<style>
	.header-container {
		border-bottom: 1px solid var(--text-placeholder);
		display: flex;
		flex-direction: column;
	}

	.header-content {
		margin-bottom: 0.4rem;
		display: flex;
		justify-content: space-between;
	}

	.close-button {
		padding: 0.2rem;
		border-radius: 6px;
		display: flex;
		align-self: flex-start;
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

	.title {
		margin-bottom: 1rem;
		font-size: 2.8rem;
		font-weight: 500;
	}

	.new-license {
		color: var(--text-placeholder);
	}
</style>
