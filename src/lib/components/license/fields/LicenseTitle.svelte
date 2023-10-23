<script lang="ts">
	import { goto } from '$app/navigation';
	import { license } from '$lib/stores/license-store';
	import { showModal } from '$lib/stores/modal.ts';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';

	function handleClick() {
		goto('/');
		showModal.set(false);
	}
</script>

<div class="title-container">
	<div class="top-container">
		<h3 class="id-label">#838</h3>
		<a href="/" class="back-link" on:click|preventDefault={handleClick}>
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
	.title-container {
		display: flex;
		flex-direction: column;
		grid-column: 1 / -1;
		border-bottom: 1px solid var(--text-placeholder);
		margin-bottom: 4rem;
		cursor: default;
	}

	.top-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 0 0.4rem 0;
	}

	.title-label {
		font-size: 2.8rem;
		font-weight: 500;
		margin: 0 0 1rem 0;
	}

	.new-license-label {
		font-size: 2.8rem;
		font-weight: 500;
		margin: 0 0 1rem 0;
		color: var(--text-placeholder);
	}

	.id-label {
		font-size: 1rem;
	}

	.back-link {
		font-size: 1rem;
		text-decoration: none;
		color: black;
		transition: color 0.25s ease;
		display: flex;
		align-self: center;
		padding: 0.2rem;
		border-radius: 6px;
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
</style>
