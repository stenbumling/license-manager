<script lang="ts">
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let required: boolean = false;
	export let options: string[];
	export let defaultOption: string = '';
	export let placeholder: string = 'Select an option';
	export let type: 'primary' | 'secondary' = 'primary';
	export let errorMessage: { message: string } | undefined;

	const id = uuidv4();

	$: value = !value && defaultOption && options.includes(defaultOption) ? defaultOption : value;
	$: selectStyle = value ? '' : 'unselected';
</script>

<div class="select-field-container">
	<h3 class={type === 'primary' ? 'primary-select-label' : 'secondary-select-label'} {id}>
		{label}
		{#if required}
			<span class="required">*</span>
		{/if}
	</h3>
	<select class={selectStyle} bind:value name={label} {required} aria-labelledby={id}>
		<option hidden value="">{placeholder}</option>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
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
	.select-field-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-height: 7rem;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.primary-select-label {
		margin-bottom: 0.4rem;
	}

	.secondary-select-label {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #888888;
	}

	.required {
		color: red;
	}

	.unselected {
		appearance: auto;
		color: gray;
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

	.slotted-field {
		margin-top: 1.4rem;
		width: 100%;
	}

	select {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		appearance: none;
		box-sizing: border-box;
		padding: 0;
	}

	select:hover {
		border: 1px dashed black;
		cursor: pointer;
		appearance: auto;
		padding: 0.3rem;
	}

	select:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		appearance: auto;
		padding: 0.3rem;
	}

	option {
		color: black;
		font-style: normal;
	}
</style>
