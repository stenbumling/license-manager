<script lang="ts">
	import { license } from '$lib/stores/license-store.ts';
	import type { User } from '$lib/stores/user-store';
	import { userStore } from '$lib/stores/user-store';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';
	import { slide } from 'svelte/transition';

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

	async function handleAssignUser(addedUser: string) {
		userInput = '';
		userSuggestions = [];
		inputField.blur();
		try {
			const foundUser = await userStore.findOrCreateUser(addedUser);

			$license.users = [...$license.users, foundUser];
		} catch (error) {
			console.error('Failed to add or find user:', error);
		}
	}

	function handleRemoveUser(user: User) {
		$license.users = $license.users.filter((u) => u.id !== user.id);
	}
</script>

<div class="component-container">
	<h3 class="label">
		Assigned users
		<span class="required">*</span>
	</h3>
	{#if $license.users.length}
		<div class="badge-container">
			{#each $license.users.slice(0, 8) as user}
				<div class="badge">
					<div class="badge-text">{user.name}</div>
					<button class="badge-delete-button" on:click={() => handleRemoveUser(user)}>
						<CloseFilled fill="white" size={16} />
					</button>
				</div>
			{/each}
			{#if $license.users.length > 8}
				<button class="badge view-all-button">
					<h4 class="view-all-button-text">View all ({$license.users.length})</h4>
				</button>
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
			<ul class="suggestions-list" in:slide={{ duration: 100 }}>
				{#each userSuggestions as suggestion}
					<li>
						<div
							role="button"
							tabindex="0"
							on:mousedown|preventDefault
							on:mouseup={() => handleAssignUser(suggestion.name)}
						>
							{suggestion.name}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
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
	.required {
		color: red;
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
		height: 34px;
	}

	.badge-text {
		box-sizing: border-box;
		font-size: 0.8rem;
		margin-right: 0.5rem;
		white-space: nowrap;
		padding-top: 1px;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 12rem;
		user-select: none;
	}
	
	.view-all-button {
		cursor: pointer;
		transition: background-color 0.2s ease;
		/* text-align: center; */
		/* display: flex; */
		/* justify-content: center; */
		/* font-size: 0.8rem; */
		/* padding-top: 1px; */
		padding: 1px 1rem 0 1rem;
	}

	.view-all-button:hover {
		background-color: var(--light-purple)
	}

	.view-all-button-text {
		user-select: none;
		cursor: pointer;
	}

	.badge-delete-button {
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
	}
	
	.badge-delete-button:hover > :global(svg) {
		transition: fill 0.2s ease;
		fill: #c7c7c7;
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
