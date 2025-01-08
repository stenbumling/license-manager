<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { userStore } from '$lib/stores/resources/user-store';
	import type { UserData } from '$lib/types/user-types';
	import WarningFilled from 'carbon-icons-svelte/lib/WarningFilled.svelte';
	import ClearButton from '../misc/buttons/ClearButton.svelte';

	export let user: UserData;
</script>

<div
	class="badge"
	style:background-color={user.active ? `var(--color-primary-purple)` : `var(--color-alert-dark)`}
>
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
	<ClearButton action={() => userStore.unassignUser(user)} color="white" size={16} />
</div>

<style>
	.badge {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		border-radius: 0.5rem;
		padding: 0.35rem 0.6rem;
		color: var(--color-white);
	}

	.badge-text-container {
		display: flex;
		max-width: 12rem;
		margin-right: 0.5rem;
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
</style>
