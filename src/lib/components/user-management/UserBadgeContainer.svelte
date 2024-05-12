<script lang="ts">
	import AssignedUsersModal from '$lib/components/user-management/AssignedUsersModal.svelte';
	import UserBadge from '$lib/components/user-management/UserBadge.svelte';
	import { showAssignedUsersModal } from '$lib/stores/modal-store';
	import { userFetchRequest } from '$lib/stores/request-state-store';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import { receive, send } from '$lib/utils/animation-utils';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import { Pulse } from 'svelte-loading-spinners';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
</script>

<div class="badge-container">
	{#each $currentLicense.users.slice(0, 8) as user (user.id)}
		<div in:receive={{ key: user.id }} out:send={{ key: user.id }} animate:flip={{ duration: 200 }}>
			<UserBadge {user} />
		</div>
	{/each}
	{#if $currentLicense.users.length > 8}
		<button class="view-all-button" on:click={() => showAssignedUsersModal.set(true)}>
			<div class="badge-view-icon">
				<ViewFilled size={16} />
			</div>
			<h4 class="view-all-button-text" in:fade={{ duration: 120 }}>
				View all {$currentLicense.users.length}
			</h4>
		</button>
	{/if}
	{#if $userFetchRequest.isLoading}
		<div class="loading" in:fade={{ duration: 120 }}>
			<Pulse size="20" color="white" />
		</div>
	{/if}
</div>

{#if $showAssignedUsersModal}
	<AssignedUsersModal />
{/if}

<style>
	.badge-container {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
		gap: 0.4rem 0.4rem;
	}

	.loading {
		display: flex;
		box-sizing: border-box;
		background-color: var(--deep-purple);
		color: white;
		align-items: center;
		border-radius: 0.5rem;
		padding: 0 1rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		height: 36px;
	}

	.view-all-button {
		display: flex;
		box-sizing: border-box;
		background-color: var(--deep-purple);
		color: white;
		align-items: center;
		border-radius: 0.5rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		height: 36px;
		cursor: pointer;
		transition: background-color 0.2s ease;
		padding: 1px 1rem 0 1rem;
	}

	.view-all-button:hover {
		background-color: var(--light-purple);
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
		align-items: center;
		margin-bottom: 1px;
	}
</style>
