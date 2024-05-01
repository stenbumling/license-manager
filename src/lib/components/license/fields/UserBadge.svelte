<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import type { User } from '$lib/stores/resources/user-store';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';

	export let user: User;

	function handleRemoveUser(user: User) {
		$currentLicense.users = $currentLicense.users.filter((u) => u.id !== user.id);
	}
</script>

<div
	class="badge"
	style:background-color={user.active ? `var(--deep-purple)` : '#e0e0e0'}
	style:color={user.active ? 'white' : '#888888'}
>
	{#if user.active === true}
		<div class="badge-text-container">
			<span class="badge-text">{user.name}</span>
		</div>
	{:else}
		<div
			class="badge-text-container"
			use:tooltip={{
				content:
					'This user does no longer exist on Azure AD. You can unassign the user, but you cannot reassign them. If this user is still active, please contact your administrator.',
				options: { delay: [500, 0] },
			}}
		>
			<span class="badge-text">{user.name}</span>
		</div>
	{/if}
	<button class="badge-delete-button" on:click={() => handleRemoveUser(user)}>
		<CloseFilled fill={user.active ? 'white' : '#888888'} size={16} />
	</button>
</div>

<style>
	.badge {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		border-radius: 0.5rem;
		padding: 0 0.6rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		height: 36px;
	}

	.badge-text-container {
		display: flex;
		height: 20px;
		margin-right: 0.5rem;
		max-width: 12rem;
	}

	.badge-text {
		font-size: 0.8rem;
		white-space: nowrap;
		padding-top: 2px;
		margin-left: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		user-select: none;
	}

	.badge-delete-button {
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		height: 50%;
		align-items: center;
	}

	.badge-delete-button:hover > :global(svg) {
		transition: fill 0.4s ease;
		opacity: 0.5;
	}

	.badge-delete-button:focus-within {
		box-shadow: 0 0 0 2px white;
		border-radius: 4px;
	}
</style>
