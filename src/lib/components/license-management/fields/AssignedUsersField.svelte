<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import UserBadgeContainer from '$lib/components/user-management/UserBadgeContainer.svelte';
	import UserSuggestionsDropdown from '$lib/components/user-management/UserSuggestionsDropdown.svelte';
	import { userFetchRequest } from '$lib/stores/request-state-store';
	import { currentLicense, licenseMode } from '$lib/stores/resources/license-store';
	import { userSearchInput, userStore, userSuggestions } from '$lib/stores/resources/user-store';
	import { userValidationErrors } from '$lib/validations/user-validation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	let inputField: HTMLInputElement;
	let showUserSuggestions = false;

	const id = uuidv4();

	onMount(async () => {
		await userStore.fetch();
		userSearchInput.set('');
		userStore.updateUserSuggestions('');
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			showUserSuggestions = false;
		} else if (event.key === 'Enter') {
			if ($userSearchInput) userStore.assignUser($userSearchInput);
			showUserSuggestions = false;
		}
	}

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		showUserSuggestions = true;
		userStore.updateUserSuggestions(event.currentTarget.value);
		userValidationErrors.set([]);
	}

	function handleUserClick(user: string) {
		userStore.assignUser(user);
		showUserSuggestions = false;
		inputField.blur();
	}
</script>

<div class="assigned-users-field-container">
	<!-- Assigned users -->
	<h3 class="field-label"><label for={id}>Assigned users</label></h3>
	{#if $currentLicense.users.length || $userFetchRequest.isLoading}
		<UserBadgeContainer />
	{/if}

	<!-- User input -->
	<div class="input-container">
		<input
			{id}
			class:input-add-mode={$licenseMode === 'add'}
			type="search"
			placeholder="Search for a user to assign"
			bind:value={$userSearchInput}
			bind:this={inputField}
			use:clickOutside={() => (showUserSuggestions = false)}
			on:click={() => (showUserSuggestions = true)}
			on:focus={() => (showUserSuggestions = true)}
			on:keydown={handleKeyDown}
			on:input={handleInput}
		/>

		<!-- User suggestions dropdown -->
		{#if showUserSuggestions && $userSuggestions.length && !$userFetchRequest.pendingRequests}
			<UserSuggestionsDropdown {handleUserClick} />
		{/if}

		<!-- User validation errors -->
		<p class="helper-text">
			{#if $userValidationErrors}
				<span class="error-text" transition:fade={{ duration: 120 }}>{$userValidationErrors}</span>
			{/if}
		</p>
	</div>
</div>

<style>
	.assigned-users-field-container {
		display: flex;
		flex-direction: column;
		min-height: 7rem;
		align-items: flex-start;
		box-sizing: border-box;
	}

	.field-label {
		margin-bottom: 0.4rem;
	}

	.input-container {
		position: relative;
		width: 100%;
	}

	.helper-text {
		font-size: 0.75rem;
		color: var(--color-helpertext);
		height: 2.8rem;
		margin-left: 1px;
	}

	.error-text {
		color: var(--color-alert-dark);
	}

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		font-size: 0.83rem;
		border: none;
		width: 100%;
		min-height: 3rem;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--color-placeholder-text);
		box-sizing: border-box;
		appearance: none;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 0.5rem;
		padding-bottom: 0.2rem;
	}

	.input-add-mode {
		border: 1px dashed black;
		padding-left: 0.5rem;
		padding-bottom: 0.2rem;
	}

	input:focus {
		border: 2px solid var(--color-light-purple);
		outline: none;
		padding-left: 0.43rem;
		padding-bottom: 0.2rem;
	}
</style>
