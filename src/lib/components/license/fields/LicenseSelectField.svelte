<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let required: boolean = false;
	export let options: string[];
	export let defaultOption: string = '';
	export let placeholder: string = 'Select an option';

	const id = uuidv4();

	$: {
		if (defaultOption && options.includes(defaultOption) && !value) {
			value = defaultOption;
		}
	}
</script>

<div class="select-field-container">
	<h3 class="select-field-label" {id}>
		{label}
		{#if required}
			<span class="required-asterisk">*</span>
		{/if}
	</h3>
	<select aria-labelledby={id} {required} name={label} bind:value>
		<option disabled selected hidden value="">{placeholder}</option>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
	{#if secondaryText}
		<p class="secondary-text">{secondaryText}</p>
	{/if}
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

	.select-field-label {
		margin-bottom: 0.4rem;
	}

	.required-asterisk {
		color: red;
	}

	.secondary-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		margin-top: 0.5rem;
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

	select:required:invalid {
		color: gray;
		appearance: auto;
	}

	option[value=''][disabled] {
		display: none;
	}

	option {
		color: black;
		font-style: normal;
	}
</style>
