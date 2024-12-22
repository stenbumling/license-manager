<script lang="ts">
	import buttonArrow from '$lib/images/icons/button-arrow.svg';
	import { isOnline } from '$lib/stores/network-store';
	import { Pulse } from 'svelte-loading-spinners';

	export let title: string = 'Button title';
	export let action: (e: MouseEvent | KeyboardEvent) => void;
	export let pendingRequest: boolean = false;
</script>

<div
	role="button"
	tabindex="0"
	class="button-container"
	class:pending-request={pendingRequest}
	class:disabled={!$isOnline}
	on:click|preventDefault={action}
	on:keydown={(e) => {
		if (e.key === 'Enter') {
			action(e);
		}
	}}
>
	{#if pendingRequest}
		<Pulse color="white" size={20} />
	{:else}
		<div class="button-content">
			<h3 class="button-title">{title}</h3>
			<img src={buttonArrow} alt="arrow" />
		</div>
		<div
			class="button-animated-hover"
			style:background={`linear-gradient(to right, var(--color-deep-purple) 100%, transparent 100%`}
		/>
	{/if}
</div>

<style>
	.button-container {
		position: relative;
		height: 3rem;
		min-width: 8rem;
		padding: 1rem 1.3rem;
		display: flex;
		box-sizing: border-box;
		color: var(--color-white);
		background-color: var(--color-deep-black);
		user-select: none;
		cursor: pointer;
		align-items: center;
		justify-content: center;
	}

	.button-container .button-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		transition: width 0.25s ease;
	}

	.button-container:hover .button-animated-hover {
		width: 100%;
	}

	.button-content {
		z-index: 1;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.button-title {
		margin-top: 2px;
		margin-right: 1rem;
		text-wrap: nowrap;
		overflow: hidden;
	}

	.button-container:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.pending-request {
		background-color: var(--color-deep-purple);
		pointer-events: none;
		border-radius: 6px;
	}

	h3 {
		cursor: pointer;
	}

	.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
</style>
