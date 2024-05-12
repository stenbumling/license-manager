<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { userStore } from '$lib/stores/resources/user-store';
	import type { UserData } from '$lib/types/user-types';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';
	import WarningFilled from 'carbon-icons-svelte/lib/WarningFilled.svelte';

	export let user: UserData;
</script>

<div class="badge" style:background-color={user.active ? `var(--deep-purple)` : '#d32d2d'}>
	{#if user.active !== true}
		<div
			class="badge-conflict-icon"
			use:tooltip={{
				content:
					'This user does no longer exist in your Azure AD group. You can unassign the user, but you cannot reassign them. If this user is still active, please contact your administrator.',
				options: { delay: [500, 0] },
			}}
		>
			<WarningFilled size={16} />
		</div>
	{/if}
	<div class="badge-text-container">
		<span class="badge-text">{user.name}</span>
	</div>
	<button class="badge-delete-button" on:click={() => userStore.unassignUser(user)}>
		<CloseFilled fill="white" size={16} />
	</button>
</div>

<style>
	.badge {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		border-radius: 0.5rem;
		padding: 0.5rem 0.6rem;
		color: white;
	}

	.badge-text-container {
		display: flex;
		max-width: 12rem;
	}

	.badge-text {
		font-size: 0.85rem;
		white-space: nowrap;
		padding-top: 2px;
		margin-left: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		user-select: none;
	}

	.badge-conflict-icon {
		display: flex;
		height: 100%;
		align-items: center;
		margin-right: 3px;
	}

	.badge-delete-button {
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		height: 100%;
		margin-left: 0.5rem;
		align-items: center;
	}

	.badge-delete-button:hover > :global(svg) {
		transition: fill 0.4s ease;
		opacity: 0.5;
	}

	.badge-delete-button:active > :global(svg) {
		transform: scale(0.9);
	}

	.badge-delete-button:focus-visible {
		box-shadow: 0 0 0 2px white;
		border-radius: 4px;
	}
</style>
