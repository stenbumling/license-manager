<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let placeholder: string = 'Enter some text';
	export let required: boolean = false;
	export let autocomplete: string = 'off';
	export let type: 'primary' | 'secondary' = 'primary';
	export let errorMessage: string | undefined;

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
			<span class="required">*</span>
		{/if}
	</h3>
	<textarea
		bind:value
		bind:this={textarea}
		{required}
		{placeholder}
		{autocomplete}
		on:blur={scrollToTop}
		aria-labelledby={id}
	/>
	{#if errorMessage}
		<div class="helper-text">
			<p>{errorMessage}</p>
		</div>
	{:else if secondaryText}
		<div class="secondary-text">
			<p>{secondaryText}</p>
		</div>
	{/if}
	{#if $$slots.secondary}
		<div class="slotted-field">
			<slot name="secondary" />
		</div>
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
		height: 2.8rem;
		margin-left: 1px;
	}

	.required {
		color: red;
	}

	.helper-text {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #ff0000;
	}
	
	textarea {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		font-size: 0.83rem;
		border: none;
		width: 100%;
		min-height: 6rem;
		max-height: 18rem;
		background-color: transparent;
		border: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		padding-top: 0.9rem;
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
