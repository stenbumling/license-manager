<script lang="ts">
	import { showAssignedUsersModal } from '$lib/stores/modal-store';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import { fade } from 'svelte/transition';
</script>

<button class="view-all-button" on:click={() => showAssignedUsersModal.set(true)}>
	<div class="badge-view-icon">
		<ViewFilled size={16} />
	</div>
	<h4 class="view-all-button-text" in:fade={{ duration: 120 }}>
		View all {$currentLicense.users.length} assigned users
	</h4>
</button>

<style>
	.view-all-button {
		display: flex;
		box-sizing: border-box;
		background-color: var(--color-deep-purple);
		align-items: center;
		border-radius: 0.5rem;
		padding: 0.55rem 0.8rem;
		transition: background-color 0.2s ease;
		color: white;
		cursor: pointer;
	}

	.view-all-button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.view-all-button:hover {
		background-color: var(--color-light-purple);
	}

	.view-all-button-text {
		user-select: none;
		cursor: pointer;
		margin-left: 0.5rem;
	}

	.badge-view-icon {
		box-sizing: border-box;
		display: flex;
		height: 100%;
	}
</style>
