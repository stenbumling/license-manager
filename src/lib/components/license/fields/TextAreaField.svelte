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

	let textarea: HTMLTextAreaElement;

	function scrollToTop() {
		textarea.scrollTop = 0;
	}
</script>

<div class="textarea-container">
	<h3 class={type === 'primary' ? 'primary-textarea-label' : 'secondary-textarea-label'} {id}>
		{label}
		{#if required}
			<span class="required-asterisk">*</span>
		{/if}
	</h3>
	<textarea
		aria-labelledby={id}
		{placeholder}
		{required}
		autocomplete={autoComplete}
		on:blur={scrollToTop}
		bind:this={textarea}
		bind:value
	/>
	{#if secondaryText}
		<p class="secondary-text">{secondaryText}</p>
	{/if}
</div>

<style>
	.textarea-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
		margin-bottom: 2.6rem;
	}

	.primary-textarea-label {
		margin-bottom: 0.4rem;
	}

	.secondary-textarea-label {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #888888;
	}

	.secondary-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		margin-top: 0.5rem;
		margin-left: 1px;
	}

	.required-asterisk {
		color: red;
	}

	textarea {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		min-height: 6rem;
		max-height: 18rem;
		background-color: transparent;
		border: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		padding-top: 0.8rem;
		resize: vertical;
		padding-left: 0.6rem;
		overflow: hidden;
	}

	textarea:hover {
		border: 1px dashed black;
		overflow: auto;
	}

	textarea:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		overflow: auto;
	}
</style>
