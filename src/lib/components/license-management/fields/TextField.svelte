<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { licenseMode } from '$lib/stores/resources/license-store';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	export let label: string = '';
	export let value: string;
	export let helperText: string = '';
	export let placeholder: string = 'Enter some text';
	export let required: boolean = false;
	export let autocomplete: string = 'off';
	export let type: 'primary' | 'secondary' = 'primary';
	export let errorMessage: { message: string } | undefined = undefined;

	const id = uuidv4();
</script>

<div class="text-field-container">
	<h3 class={type === 'primary' ? 'primary-field-label' : 'secondary-field-label'}>
		<label for={id}>{label}</label>
		{#if required}
			<span class="required" use:tooltip={{ content: 'Required', options: { delay: [500, 0] } }}
				>*</span
			>
		{/if}
	</h3>

	<input
		bind:value
		class:input-add-mode={$licenseMode === 'add'}
		{id}
		{required}
		{placeholder}
		{autocomplete}
	/>

	<p class="helper-text">
		{#if errorMessage}
			<span class="error-text" in:fade={{ duration: 120 }}>{errorMessage}</span>
		{:else if helperText}
			<span in:fade={{ duration: 120 }}>{helperText}</span>
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
		min-height: 12rem;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.primary-field-label {
		margin-bottom: 0.4rem;
	}

	.secondary-field-label {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #888888;
	}

	.required,
	.error-text {
		color: var(--color-alert-dark);
	}

	.helper-text {
		font-size: 0.75rem;
		color: var(--color-helpertext);
		height: 2.8rem;
		margin-left: 2px;
	}

	.slotted-field {
		width: 100%;
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
	}

	input:hover {
		border: 1px dashed black;
		padding: 0 0 0.1rem 0.5rem;
	}

	.input-add-mode {
		border: 1px dashed black;
		padding: 0 0 0.1rem 0.5rem;
	}

	input:focus {
		border: 2px solid var(--color-light-purple);
		outline: none;
		padding: 0 0 0.1rem 0.5rem;
	}
</style>
