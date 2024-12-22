<script lang="ts">
	import { currentLicense, licenseMode } from '$lib/stores/resources/license-store';
	import type { LicenseRenewalOptions } from '$lib/types/license-types';
	import { licenseValidationErrors } from '$lib/validations/license-validation';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	export let required: boolean = false;
	const id = uuidv4();

	$: label = fieldLabelChange($currentLicense.renewalInterval);
	$: costValue = calculateCost($currentLicense.renewalInterval, $currentLicense.cost);

	/** Enforce numeric input. Firefox does not prevent non-numeric input on number inputs by default. */
	function enforceNumeric(event: KeyboardEvent) {
		const validKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'End', 'Home'];

		if (!validKeys.includes(event.key) && (event.key < '0' || event.key > '9')) {
			event.preventDefault();
		}
	}

	function fieldLabelChange(renewalInterval: LicenseRenewalOptions) {
		switch (renewalInterval) {
			case 'None':
				return 'Cost';
			case 'Monthly':
				return 'Cost per month';
			case 'Annually':
				return 'Annual cost';
			default:
				return '';
		}
	}

	function calculateCost(renewalInterval: LicenseRenewalOptions, cost: number): string {
		switch (renewalInterval) {
			case 'None':
				return '';
			case 'Monthly':
				return `${Math.floor(cost * 12).toString()} SEK/year`;
			case 'Annually':
				return `${Math.floor(cost / 12).toString()} SEK/month`;
			default:
				return '';
		}
	}
</script>

<div class="cost-field-container">
	<h3 class="field-label">
		<label for={id}>{label}</label>
		{#if required}
			<span class="required">*</span>
		{/if}
	</h3>

	<div class="input-container">
		<input
			bind:value={$currentLicense.cost}
			class="number-input"
			class:input-add-mode={$licenseMode === 'add'}
			type="number"
			max="10000000"
			{id}
			{required}
			placeholder="Enter cost of license"
			on:keydown={enforceNumeric}
		/>
	</div>

	<p class="helper-text">
		{#if $licenseValidationErrors.cost}
			<span class="error-text" in:fade={{ duration: 120 }}>{$licenseValidationErrors.cost}</span>
		{:else}
			<span in:fade={{ duration: 120 }}>{`${costValue}`}</span>
		{/if}
	</p>
</div>

<style>
	.cost-field-container {
		display: flex;
		flex-direction: column;
		min-height: 7rem;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.field-label {
		margin-bottom: 0.4rem;
	}

	.required,
	.error-text {
		color: red;
	}

	.helper-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.8rem;
		margin-left: 1px;
	}

	.input-container {
		position: relative;
		width: 100%;
	}

	.input-container::after {
		content: 'SEK';
		position: absolute;
		top: 0.9rem;
		right: 1rem;
		font-size: 0.75rem;
		color: var(--text-placeholder);
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
		padding: 0 0 0 0.5rem;
	}

	.input-add-mode {
		border: 1px dashed black;
		padding: 0 0 0 0.5rem;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding: 0 0 0 0.5rem;
	}
</style>
