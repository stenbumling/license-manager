<script lang="ts">
	import AssignedUsersModal from '$lib/components/user-management/AssignedUsersModal.svelte';
	import UserBadge from '$lib/components/user-management/UserBadge.svelte';
	import { showAssignedUsersModal } from '$lib/stores/modal-store';
	import { userFetchRequest } from '$lib/stores/request-state-store';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import { receive, send } from '$lib/utils/animation-utils';
	import { Pulse } from 'svelte-loading-spinners';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import ViewAllUsersButton from './ViewAllUsersButton.svelte';
</script>

<div class="badge-container">
	{#each $currentLicense.users.slice(0, 8) as user (user.id)}
		<div in:receive={{ key: user.id }} out:send={{ key: user.id }} animate:flip={{ duration: 200 }}>
			<UserBadge {user} />
		</div>
	{/each}
	{#if $currentLicense.users.length > 8}
		<ViewAllUsersButton />
	{/if}
	{#if $userFetchRequest.isLoading}
		<div class="loading-indicator" in:fade={{ duration: 120 }}>
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

	.loading-indicator {
		display: flex;
		box-sizing: border-box;
		background-color: var(--color-primary-purple);
		color: var(--color-white);
		align-items: center;
		border-radius: 0.5rem;
		padding: 0 1rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		height: 36px;
	}
</style>
