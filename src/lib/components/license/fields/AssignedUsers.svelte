<script lang="ts">
	import { license } from '$lib/stores/license-store.ts';
	import { v4 as uuidv4 } from 'uuid';

	const id = uuidv4();
</script>

<div class="text-field-container">
	<h3 class="primary-text-label" {id}>
		Assigned users
		<span class="required">*</span>
	</h3>
	<div>
		{#each $license.users as user}
			<p>{user.name}</p>
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
