<script lang="ts">
	import type { Application } from '$lib/stores/application-store';
	import { applicationStore } from '$lib/stores/application-store';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

	export let application: Application;

	function handleDelete() {
		applicationStore.delete(application.id);
	}
</script>

<div class="application-item">
	<button class="trashcan-icon" on:click={handleDelete}>
		<TrashCan size={24} fill="red" />
	</button>
	<p class="application-name">{application.name}</p>
</div>

<style>
	.application-item {
		width: 100%;
		height: 4rem;
		margin: 0 0 0.2rem 0;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		align-items: center;
	}

	.trashcan-icon {
		position: relative;
		top: -1px;
		width: 2rem;
		min-width: 2rem;
		height: 2rem;
		margin-right: 1rem;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.trashcan-icon:hover {
		background-color: #ffefef;
	}

	.application-name {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
