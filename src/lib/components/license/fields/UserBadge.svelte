<script lang="ts">
	import { license } from '$lib/stores/resources/license-store';
	import type { User } from '$lib/stores/resources/user-store';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';
	import { fade } from 'svelte/transition';

	export let user: User;

	function handleRemoveUser(user: User) {
		$license.users = $license.users.filter((u) => u.id !== user.id);
	}
</script>

<div class="badge">
	<div class="badge-text-container">
		<span class="badge-text">{user.name}</span>
	</div>
	<button class="badge-delete-button" on:click={() => handleRemoveUser(user)}>
		<CloseFilled fill="white" size={16} />
	</button>
</div>

<style>
	.badge {
		display: flex;
		box-sizing: border-box;
		background-color: var(--deep-purple);
		color: white;
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
		color: white;
		font-size: 0.8rem;
		white-space: nowrap;
		padding-top: 1px;
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
		fill: white;
	}

	.badge-delete-button:focus-within {
		box-shadow: 0 0 0 2px white;
		border-radius: 4px;
	}
</style>
