<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	type FieldType = 'primary' | 'secondary';

	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let placeholder: string = 'Enter some text';
	export let required: boolean = false;
	export let autoComplete: string = 'off';
	export let type: FieldType = 'primary';

	const id = uuidv4();
	let containerClass: string = 'text-field-container';

	$: {
		containerClass =
			type === 'secondary' ? 'text-field-secondary-container' : 'text-field-container';
	}
</script>

<div class={containerClass}>
	<h3 class={type === 'primary' ? 'primary-text-label' : 'secondary-text-label'} {id}>
		{label}
		{#if required}
			<span class="required-asterisk">*</span>
		{/if}
	</h3>
	<input
		type="text"
		aria-labelledby={id}
		{placeholder}
		{required}
		autocomplete={autoComplete}
		bind:value
	/>
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
	.text-field-container {
		display: flex;
		flex-direction: column;
		min-height: 10rem;
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

	.interval-field {
		margin-top: 1.4rem;
		width: 100%;
	}

	.secondary-text-label {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #888888;
	}

	.secondary-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.36rem;
		margin-left: 1px;
	}

	.required-asterisk {
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
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 0.3rem;
	}

	@media (max-height: 1080px) {
		.text-field-container {
			min-height: 7rem;
		}
	}
</style>
