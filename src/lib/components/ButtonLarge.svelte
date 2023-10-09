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

<a href="/add-new" class="button" on:click={handleClick}>
	<div class="button-animated-hover" />
	<h3 class="button-text">{title}</h3>
</a>

<style>
	.button {
		cursor: pointer;
		display: flex;
		align-items: center;
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

	.button .button-animated-hover {
		position: absolute;
		left: 0;
		width: 0;
		height: 100%;
		background: linear-gradient(to right,var(--deep-purple) 50%,transparent 50%);
		transition: width 0.25s ease;
	}

	.button:hover .button-animated-hover {
		width: 200%;
	}

	.button-text {
		z-index: 1;
		margin-top: 2px;
	}
</style>
