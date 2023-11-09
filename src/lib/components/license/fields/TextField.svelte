<script lang="ts">
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let placeholder: string = 'Enter some text';
	export let required: boolean = false;
	export let autocomplete: string = 'off';
	export let type: 'primary' | 'secondary' = 'primary';
	export let errorMessage: { message: string } | undefined;

	const id = uuidv4();

	let textContainer: string =
		type === 'secondary' ? 'text-field-secondary-container' : 'text-field-container';
</script>

<div class={textContainer}>
	<h3 class={type === 'primary' ? 'primary-text-label' : 'secondary-text-label'} {id}>
		{label}
		{#if required}
			<span class="required">*</span>
		{/if}
	</h3>
	<input bind:value type="text" aria-labelledby={id} {required} {placeholder} {autocomplete} />
	<p class="secondary-text" class:warning-text={errorMessage}>
		{#if errorMessage}
		<span in:fade={{ duration: 120 }}>{errorMessage}</span>
		{:else if secondaryText}
		<span in:fade={{ duration: 120 }}>{secondaryText}</span>
		{/if}
	</p>
	{#if $$slots.secondary}
		<div class="slotted-field">
			<slot name="secondary" />
		</div>
	{/if}
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

	.text-field-secondary-container {
		display: flex;
		flex-direction: column;
		min-height: 6rem;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.primary-text-label {
		margin-bottom: 0.4rem;
	}

	.secondary-text-label {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #888888;
	}

	.required {
		color: red;
	}

	.secondary-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.8rem;
		margin-left: 1px;
	}

	.slotted-field {
		margin-top: 1.4rem;
		width: 100%;
	}

	.warning-text {
		color: #ff0000;
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
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 0.3rem;
	}
</style>
