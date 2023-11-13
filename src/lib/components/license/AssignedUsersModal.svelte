<script lang="ts">
	import CloseModalButton from '$lib/components/misc/buttons/CloseModalButton.svelte';
	import { license } from '$lib/stores/license-store.ts';
	import { modal } from '$lib/stores/modal-store';
	import type { User } from '$lib/stores/user-store';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';
	import { fade } from 'svelte/transition';

	function handleRemoveUser(user: User) {
		$license.users = $license.users.filter((u) => u.id !== user.id);
	}
</script>

<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window">
		<div class="modal-header">
			<h1 class="modal-title">Assigned<br />users</h1>
			<CloseModalButton action={modal.closeAssignedUsers} />
		</div>
		<h3>List of assigned users</h3>
		<div class="badge-container">
			{#each $license.users as user}
				<div class="badge">
					<div class="badge-text-container">
						<span class="badge-text">{user.name}</span>
					</div>
					<button class="badge-delete-button" on:click={() => handleRemoveUser(user)}>
						<CloseFilled fill="#f9e8ff" size={16} />
					</button>
				</div>
			{/each}
		</div>
	</dialog>
</div>

<style>
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
	}

	.modal-window {
		width: 40vw;
		max-width: 30rem;
		max-height: 60vh;
		padding: 3rem 4rem;
		border: none;
		display: flex;
		flex-direction: column;
		align-self: center;
		background-color: white;
	}

	.modal-header {
		margin: 0 0 3rem 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.modal-title {
		margin: 0;
		font-size: 2rem;
	}

	.badge-container {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

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
		color: #f9e8ff;
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
		height: 100%;
		align-items: center;
	}

	.badge-delete-button:hover > :global(svg) {
		transition: fill 0.4s ease;
		fill: white;
	}

	h3 {
		margin-bottom: 0.4rem;
	}
</style>
