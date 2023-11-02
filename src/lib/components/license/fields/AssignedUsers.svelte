<script lang="ts">
	import { license } from '$lib/stores/license-store.ts';
	import type { User } from '$lib/stores/user-store';
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';
	import { v4 as uuidv4 } from 'uuid';

	const id = uuidv4();

	function handleAddUser(user: User) {
		$license.users = [...$license.users, user];
	}

	function handleRemoveUser(user: User) {
		$license.users = $license.users.filter((u) => u.id !== user.id);
	}
</script>

<div class="text-field-container">
	<h3 class="primary-text-label" {id}>
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
	<input type="text" aria-labelledby={id} required placeholder="Search for user to add" />
</div>

<style>
	.text-field-container {
		display: flex;
		flex-direction: column;
		min-height: 7rem;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
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
		padding-left: 0.3rem;
		padding-bottom: 0.1rem;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 0.25rem;
		padding-bottom: 0.1rem;
	}
</style>
