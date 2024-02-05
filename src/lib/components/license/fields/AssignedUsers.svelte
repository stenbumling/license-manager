<script lang="ts">
	import AssignedUsersModal from '$lib/components/license/AssignedUsersModal.svelte';
	import UserBadge from '$lib/components/license/fields/UserBadge.svelte';
	import { license } from '$lib/stores/license-store.ts';
	import { userFetchRequest } from '$lib/stores/request-state-store';
	import { showAssignedUsersModal } from '$lib/stores/modal-store';
	import type { User } from '$lib/stores/user-store';
	import { userStore } from '$lib/stores/user-store';
	import { userValidationErrors, validateUser } from '$lib/validations/user-validation';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import { Pulse } from 'svelte-loading-spinners';
	import { fade, slide } from 'svelte/transition';

	let userInput = '';
	let userSuggestions: User[] = [];
	let inputField: HTMLInputElement;
	let isInputFieldFocused = false;

	// Renders user suggestions based on the input value and assigned users
	$: {
		const assignedUsers = new Set($license.users.map((user) => user.id));
		if (userInput.trim()) {
			userSuggestions = $userStore
				.filter(
					(user) =>
						user.name.toLowerCase().startsWith(userInput.toLowerCase()) &&
						!assignedUsers.has(user.id),
				)
				.sort((a, b) => a.name.localeCompare(b.name));
		} else if (isInputFieldFocused) {
			userSuggestions = $userStore
				.filter((user) => !assignedUsers.has(user.id))
				.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			userSuggestions = [];
		}
	}

	async function handleAssignUser(addedUserName: string) {
		const isValid = await validateUser(addedUserName);
		userSuggestions = [];
		if (isValid) {
			try {
				const foundUser = await userStore.findOrCreateUser(addedUserName);

				const isAlreadyAssigned = $license.users.some((u) => u.id === foundUser.id);

				if (isAlreadyAssigned) {
					userValidationErrors.set(['User is already assigned']);
				} else {
					$license.users = [...$license.users, foundUser];
					userInput = '';
					inputField.blur();
					userValidationErrors.set([]);
				}
			} catch (error) {
				console.error('Failed to add or find user:', error);
			}
		}
	}
</script>

<div class="component-container">
	<h3 class="label">Assigned users</h3>
	{#if $license.users.length || $userFetchRequest.isLoading}
		<div class="badge-container">
			{#each $license.users.slice(0, 8) as user (user.id)}
				<UserBadge {user} />
			{/each}
			{#if $license.users.length > 8}
				<button class="view-all-button" on:click={() => showAssignedUsersModal.set(true)}>
					<div class="badge-view-icon">
						<ViewFilled size={16} />
					</div>
					<h4 class="view-all-button-text" in:fade={{ duration: 120 }}>
						View all {$license.users.length}
					</h4>
				</button>
			{/if}
			{#if $userFetchRequest.isLoading}
				<div class="loading" in:fade={{ duration: 120 }}>
					<Pulse size="20" color="white" />
				</div>
			{/if}
		</div>
	{/if}
	<div class="input-container">
		<input
			type="search"
			placeholder="Select or add new user"
			bind:value={userInput}
			bind:this={inputField}
			on:focus={() => (isInputFieldFocused = true)}
			on:blur={() => (isInputFieldFocused = false)}
			on:keydown={(e) => {
				if (e.key === 'Enter' && userInput === '') {
					inputField.blur();
				} else if (e.key === 'Enter') {
					handleAssignUser(userInput);
				}
			}}
		/>
		{#if userSuggestions.length}
			<ul role="menu" class="suggestions-list" in:slide={{ duration: 100 }}>
				{#each userSuggestions as suggestion}
					<li
						role="menuitem"
						tabindex="0"
						on:mousedown|preventDefault
						on:mouseup={() => handleAssignUser(suggestion.name)}
					>
						{suggestion.name}
					</li>
				{/each}
			</ul>
		{/if}
		<p class="secondary-text" class:warning-text={$userValidationErrors}>
			{#if $userValidationErrors}
				<span transition:fade={{ duration: 120 }}>{$userValidationErrors}</span>
			{/if}
		</p>
	</div>

	{#if $showAssignedUsersModal}
		<AssignedUsersModal />
	{/if}
</div>

<style>
	.component-container {
		display: flex;
		flex-direction: column;
		min-height: 7rem;
		align-items: flex-start;
		box-sizing: border-box;
	}

	.label {
		margin-bottom: 0.4rem;
	}

	.badge-container {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
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

	.secondary-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.8rem;
		margin-left: 1px;
	}

	.warning-text {
		color: red;
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

	.input-container {
		position: relative;
		width: 100%;
	}

	.suggestions-list {
		list-style-type: none;
		padding: 0;
		margin-top: 0;
		position: absolute;
		background-color: white;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
		width: 100%;
		border: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		max-height: 14rem;
		overflow-y: auto;
	}
	.suggestions-list li {
		padding: 8px 16px;
		cursor: pointer;
	}

	.suggestions-list li:hover {
		background-color: #f0f0f0;
	}

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		font-size: 0.83rem;
		border: none;
		width: 100%;
		min-height: 3rem;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 0.5rem;
		padding-bottom: 0.1rem;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 0.43rem;
		padding-bottom: 0.1rem;
	}
</style>
