<script lang="ts">
	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let placeholder: string = 'Enter some text';
	export let required: boolean = false;
	export let autoComplete: string = 'off';

	function scrollToTop() {
		const textarea = document.querySelector('textarea');
		if (textarea) {
			textarea.scrollTop = 0;
		}
	}
</script>

<div class="field-container">
	<h3 class="field-label">
		{label}
		{#if required}
			<span class="required-asterisk">*</span>
		{/if}
	</h3>
	<textarea bind:value {placeholder} {required} autocomplete={autoComplete} on:blur={scrollToTop} />
	{#if secondaryText}
		<p class="secondary-text">{secondaryText}</p>
	{/if}
</div>

<style>
	.field-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.field-label {
		margin-bottom: 0.4rem;
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
		min-height: 3rem;
		height: 7rem;
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
