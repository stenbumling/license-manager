<script lang="ts">
	import { license } from '$lib/stores/license-store.ts';
	import type { User } from '$lib/stores/user-store';
	import { userStore } from '$lib/stores/user-store';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';
	import { slide } from 'svelte/transition';

	let userInput = '';
	let blurTimeout: number | undefined;
	let userSuggestions: User[] = [];
	let isInputFocused = false;

	$: {
		const assignedUserIds = new Set($license.users.map((user) => user.id));
		if (userInput.trim()) {
			userSuggestions = $userStore.filter(
				(user) =>
					user.name.toLowerCase().startsWith(userInput.toLowerCase()) &&
					!assignedUserIds.has(user.id),
			);
		} else if (isInputFocused) {
			userSuggestions = $userStore.filter((user) => !assignedUserIds.has(user.id));
		} else {
			userSuggestions = [];
		}
	}

	async function handleAddUser(inputUser: User) {
		const userFromStore = $userStore.find(
			(u) => u.name.toLowerCase() === inputUser.name.toLowerCase(),
		);

		if (userFromStore) {
			const isAlreadyAssigned = $license.users.some((u) => u.id === userFromStore.id);
			if (!isAlreadyAssigned) {
				$license.users = [...$license.users, userFromStore];
			} else {
				console.error('User is already assigned to the license.');
			}
		} else {
			try {
				const newUser = await userStore.add(inputUser);
				if (newUser) {
					$license.users = [...$license.users, newUser];
				}
			} catch (error) {
				console.error('Failed to add new user:', error);
			}
		}

		userInput = '';
		userSuggestions = [];
	}

	function handleRemoveUser(user: User) {
		$license.users = $license.users.filter((u) => u.id !== user.id);
	}

	function handleSelectUser(userId: string) {
		clearTimeout(blurTimeout);
		const userToAdd = $userStore.find((user) => user.id === userId);
		if (userToAdd) {
			handleAddUser(userToAdd);
		}
		isInputFocused = false;
	}

	function handleInputFocus() {
		isInputFocused = true;
		clearTimeout(blurTimeout);
	}

	function handleInputBlur() {
		blurTimeout = setTimeout(() => {
			isInputFocused = false;
		}, 200);
	}
</script>

<div class="text-field-container">
	<h3 class="primary-text-label">
		Assigned users
		<span class="required">*</span>
	</h3>
	<div class="badge-container">
		{#each $license.users as user}
			<div class="badge">
				<div class="badge-text">{user.name}</div>
				<button class="badge-delete" on:click={() => handleRemoveUser(user)}>
					<CloseFilled fill="white" size={16} />
				</button>
			</div>
		{/each}
	</div>
	<div class="input-container">
		<input
			type="search"
			bind:value={userInput}
			placeholder="Search for user to add"
			on:focus={handleInputFocus}
			on:blur={handleInputBlur}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					handleAddUser({ id: '', name: userInput });
				}
			}}
		/>

		{#if userSuggestions.length}
			<ul class="suggestions-list" transition:slide={{ duration: 100 }}>
				{#each userSuggestions as suggestion}
					<li on:click={() => handleSelectUser(suggestion.id)}>{suggestion.name}</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.suggestions-list {
		list-style-type: none;
		padding: 0;
		margin-top: 0;
		position: absolute;
		background-color: white;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
		width: 100%;
		top: 100%;
		left: 0;
		border-radius: 0 0 4px 4px;
		border: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		max-height: 200px;
		overflow-y: auto;
	}

	.input-container {
		position: relative;
	}

	.suggestions-list li {
		padding: 8px 16px;
		cursor: pointer;
	}

	.suggestions-list li:hover {
		background-color: #f0f0f0;
	}
	.text-field-container {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		min-height: 7rem;
	}

	.primary-text-label {
		margin-bottom: 0.4rem;
	}
	.required {
		color: red;
	}

	.badge-container {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
	}

	.badge {
		display: flex;
		box-sizing: border-box;
		background-color: var(--deep-purple);
		color: white;
		align-items: center;
		text-align: center;
		border-radius: 0.5rem;
		padding: 0.3rem 0.6rem;
		margin: 0.2rem 0.4rem 0.2rem 0;
		height: 2rem;
	}

	.badge-text {
		box-sizing: border-box;
		font-size: 0.8rem;
		margin-right: 0.5rem;
		display: flex;
		align-items: center;
	}

	.badge-delete {
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
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
