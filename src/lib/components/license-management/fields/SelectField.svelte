<script lang="ts">
	import { licenseMode } from '$lib/stores/resources/license-store';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	export let label: string = '';
	export let value: string = '';
	export let helperText: string = '';
	export let required: boolean = false;
	export let options: string[] = ['No options provided'];
	export let defaultOption: string = options[0];
	export let placeholder: string = 'Select an option';
	export let type: 'primary' | 'secondary' = 'primary';
	export let errorMessage: { message: string } | undefined = undefined;

	const id = uuidv4();

	// Sets the value to the default option if the value is empty and the default option is valid
	$: value = !value && defaultOption && options.includes(defaultOption) ? defaultOption : value;
	$: selectStyle = value ? '' : 'unselected';
</script>

<div class="select-field-container">
	<h3 class={type === 'primary' ? 'primary-field-label' : 'secondary-field-label'}>
		<label for={id}>{label}</label>
		{#if required}
			<span class="required">*</span>
		{/if}
	</h3>

	<select
		class={selectStyle}
		class:select-add-mode={$licenseMode === 'add'}
		bind:value
		{required}
		{id}
	>
		<option hidden value="">{placeholder}</option>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>

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
	.select-field-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-height: 7rem;
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
		color: red;
	}

	.unselected {
		appearance: auto;
		color: gray;
	}

	.helper-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.8rem;
		margin-left: 1px;
	}

	.slotted-field {
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
		padding: 0 0 0.1rem 0.5rem;
		background-image: url('$lib/images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	.select-add-mode {
		border: 1px dashed black;
		padding: 0 0 0.1rem 0.5rem;
		background-image: url('$lib/images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	select:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding: 0 0 0.1rem 0.5rem;
		background-image: url('$lib/images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	option {
		color: black;
		font-style: normal;
	}
</style>
