<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	type FieldType = 'primary' | 'secondary';

	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let required: boolean = false;
	export let options: string[];
	export let defaultOption: string = '';
	export let placeholder: string = 'Select an option';
	export let type: FieldType = 'primary';

	const id = uuidv4();

	$: {
		if (defaultOption && options.includes(defaultOption) && !value) {
			value = defaultOption;
		}
	}
	$: unselectedStyle = value ? '' : 'unselected';
</script>

<div class="select-field-container">
	<h3 class={type === 'primary' ? 'primary-select-label' : 'secondary-select-label'} {id}>
		{label}
		{#if required}
			<span class="required-asterisk">*</span>
		{/if}
	</h3>
	<select aria-labelledby={id} {required} name={label} bind:value class={unselectedStyle}>
		<option hidden value="">{placeholder}</option>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
	<div class="secondary-text">
		{#if secondaryText}
			<p>{secondaryText}</p>
		{/if}
	</div>
	<div class="interval-field">
		<slot name="secondary" />
	</div>
</div>

<style>
	.select-field-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.primary-select-label {
		margin-bottom: 0.4rem;
	}

	.interval-field {
		margin-top: 1.4rem;
		width: 100%;
	}

	.secondary-select-label {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #888888;
	}

	.required-asterisk {
		color: red;
	}

	.unselected {
		appearance: auto;
		color: gray;
	}

	.secondary-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.36rem;
		margin-left: 1px;
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
