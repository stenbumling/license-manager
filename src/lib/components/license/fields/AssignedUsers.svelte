<script lang="ts">
	import AssignedUsersModal from '$lib/components/license/fields/AssignedUsersModal.svelte';
	import UserBadge from '$lib/components/license/fields/UserBadge.svelte';
	import { showAssignedUsersModal } from '$lib/stores/modal-store';
	import { userFetchRequest } from '$lib/stores/request-state-store';
	import { currentLicense, licenseMode } from '$lib/stores/resources/license-store';
	import { userStore } from '$lib/stores/resources/user-store';
	import { receive, send } from '$lib/utils/animation-utils.ts';
	import { userValidationErrors, validateUser } from '$lib/validations/user-validation';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import { onMount } from 'svelte';
	import { Pulse } from 'svelte-loading-spinners';
	import { flip } from 'svelte/animate';
	import { fade, slide } from 'svelte/transition';

	onMount(async () => {
		await userStore.fetch();
	});

	$: userSuggestions = $userStore.filter((user) => {
		const assignedUser = $currentLicense.users.find((u) => u.id === user.id);
		const inactiveUser = user.active === false;
		return !assignedUser && !inactiveUser;
	});

	let inputField: HTMLInputElement;
	let inputFieldFocused = false;
	let userInput = '';

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const input = event.currentTarget.value.trim().toLowerCase();

		userSuggestions = $userStore.filter((user) => {
			const userName = user.name.toLowerCase();
			const userAlreadyAssigned = $currentLicense.users.find((u) => u.id === user.id);
			const userIsInactive = user.active === false;

			return userName.includes(input) && !userAlreadyAssigned && !userIsInactive;
		});
		userValidationErrors.set([]);
	}

	async function handleAssignUser(assignedUsername: string) {
		const isValid = await validateUser(assignedUsername);
		const userToAssign = $userStore.find((user) => user.name === assignedUsername);
		const userAlreadyAssigned = $currentLicense.users.find((u) => u.id === userToAssign?.id);

		if (!isValid) {
			inputField.blur();
			return;
		} else if (!userToAssign) {
			userValidationErrors.set(['User does not exist']);
		} else if (userAlreadyAssigned) {
			userValidationErrors.set(['User is already assigned']);
			userInput = '';
		} else {
			$currentLicense.users = [...$currentLicense.users, userToAssign];
			userInput = '';
		}

		inputField.blur();
	}
</script>

<div class="component-container">
	<!-- User badges -->
	<h3 class="label">Assigned users</h3>
	{#if $currentLicense.users.length || $userFetchRequest.isLoading}
		<div class="badge-container">
			{#each $currentLicense.users.slice(0, 8) as user (user.id)}
				<div
					in:receive={{ key: user.id }}
					out:send={{ key: user.id }}
					animate:flip={{ duration: 200 }}
				>
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
	{/if}

	<!-- User input -->
	<div class="input-container">
		<input
			class:input-add-mode={$licenseMode === 'add'}
			type="search"
			placeholder="Search for a user to assign"
			bind:value={userInput}
			bind:this={inputField}
			on:focus={() => (inputFieldFocused = true)}
			on:blur={() => (inputFieldFocused = false)}
			on:input={handleInput}
			on:keydown={(e) => {
				if (e.key === 'Enter' && userInput === '') {
					inputField.blur();
				} else if (e.key === 'Enter') {
					handleAssignUser(userInput);
				}
			}}
		/>

		<!-- User suggestions dropdown -->
		{#if inputFieldFocused && userSuggestions.length && !$userFetchRequest.pendingRequests}
			<ul role="menu" class="suggestions-list" in:slide={{ duration: 100 }}>
				{#each userSuggestions as suggestion}
					<li
						role="menuitem"
						tabindex="-1"
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
		appearance: none;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 0.5rem;
		padding-bottom: 0.1rem;
	}

	.input-add-mode {
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
