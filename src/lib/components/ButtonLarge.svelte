<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/license/Modal.svelte';
	import { showModal } from '$lib/stores/modal.ts';

	export let title: string;

	function handleClick(e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}

		e.preventDefault();
		goto('/?modal=add-new');
		showModal.set(true);
	}
</script>

{#if $showModal}
	<Modal />
{/if}

<a href="/add-new" class="button-container" on:click={handleClick}>
	<div class="button-content">
		<h3 style="margin-top: 2px">{title}</h3>
		<img src={'./button-arrow.svg'} alt="arrow" />
	</div>
	<div class="button-animated-hover" />
</a>

<style>
	.button-container {
		cursor: pointer;
		display: flex;
		background-color: black;
		color: white;
		height: 3rem;
		width: 100%;
		box-sizing: border-box;
		margin-top: 1.5rem;
		padding: 1rem 1.3rem;
		text-decoration: none;
		position: relative;
	}

	.button-container .button-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		background: linear-gradient(to right, var(--deep-purple) 50%, transparent 50%);
		transition: width 0.25s ease;
	}

	.button-container:hover .button-animated-hover {
		width: 200%;
	}

	.button-content {
		z-index: 1;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
	}
</style>
