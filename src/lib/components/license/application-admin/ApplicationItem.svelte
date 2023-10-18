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
	<button class="icon" on:click={handleDelete}>
		<TrashCan size={24} fill="red" />
	</button>
	<p>{application.name}</p>
</div>

<style>
	.application-item {
		width: 100%;
		height: 4rem;
		/* background-color: red; */
		display: flex;
		align-items: center;
		margin: 0 0 0.2rem 0;
		border-bottom: 1px solid #e6e6e6;
	}

	.icon {
		width: 2rem;
		height: 2rem;
		/* background-color: #dd4848; */
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 1rem;
		cursor: pointer;
		position: relative;
		top: -1px;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #ffefef;
		}
	}
</style>
