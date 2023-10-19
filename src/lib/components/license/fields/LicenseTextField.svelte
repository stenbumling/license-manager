<script lang="ts">
	export let label: string = '';
	export let value: string = '';
	export let secondaryText: string = '';
	export let placeholder: string = 'Enter some text';
	export let required: boolean = false;
	export let autoComplete: string = 'off';
</script>

<div class="field-container">
	<h3 class="field-label">
		{label}
		{#if required}
			<span class="required-asterisk">*</span>
		{/if}
	</h3>
	<input type="text" bind:value {placeholder} {required} autocomplete={autoComplete} />
	{#if secondaryText}
		<p class="secondary-text">{secondaryText}</p>
	{/if}
</div>

<style>
	.field-container {
		display: flex;
		flex-direction: column;
		min-height: 10rem;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
		/* border: 1px solid red; */
	}

	@media (max-height: 1080px) {
		.field-container {
			min-height: 7rem;
		}
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

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
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
