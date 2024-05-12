<script lang="ts">
	import SelectField from '$lib/components/license-management/fields/SelectField.svelte';
	import TextField from '$lib/components/license-management/fields/TextField.svelte';
	import { currentLicense, licenseMode } from '$lib/stores/resources/license-store';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import { licenseValidationErrors } from '$lib/validations/license-validation';
	import { fade, slide } from 'svelte/transition';

	let label: string = '';
	$: costValue = calculateCost($currentLicense.renewalInterval, $currentLicense.cost);
	$: label = $currentLicense.autoRenewal ? 'Renewal date' : 'Expiration date';
	$: daysLeft = getRelativeDate($currentLicense.expirationDate);
	$: if (!$currentLicense.autoRenewal) $currentLicense.renewalInterval = 'None';

	// Calculate cost based on renewal interval
	function calculateCost(renewalInterval: string, cost: number): string {
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

<div class="expiration-container">
	<h3 class="expiration-label">
		{label}
		<span class="required">*</span>
	</h3>
	<div class="expiration-row">
		<!-- Date input -->
		<input
			class="date-picker"
			class:date-picker-add-mode={$licenseMode === 'add'}
			type="date"
			required
			name="applications"
			bind:value={$currentLicense.expirationDate}
		/>

		<!-- Renewal checkbox -->
		<div class="renewal-checkbox">
			<input
				type="checkbox"
				id="renewal"
				name="renewal"
				value="renewal"
				bind:checked={$currentLicense.autoRenewal}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						$currentLicense.autoRenewal = !$currentLicense.autoRenewal;
					}
				}}
			/>
			<label for="renewal">Autorenewal</label>
		</div>
	</div>
	<p class="secondary-text" class:warning-text={$licenseValidationErrors.expirationDate}>
		{#if $licenseValidationErrors.expirationDate}
			<span in:fade={{ duration: 120 }}>{$licenseValidationErrors.expirationDate}</span>
		{:else}
			<span in:fade={{ duration: 120 }}>{daysLeft.text}</span>
		{/if}
	</p>

	<!-- Cost input field -->
	<div class="cost-field">
		<TextField
			bind:value={$currentLicense.cost}
			number
			label="Cost"
			secondaryText={`${costValue}`}
			type="secondary"
			placeholder="Enter cost of license"
			errorMessage={$licenseValidationErrors.cost}
		/>
	</div>

	<!-- Initially hidden autorenewal select field -->
	{#if $currentLicense.autoRenewal}
		<div transition:slide={{ duration: 80 }} class="interval-field">
			<SelectField
				bind:value={$currentLicense.renewalInterval}
				label="Renewal interval"
				options={['None', 'Monthly', 'Annually']}
				defaultOption="None"
				required
				type="secondary"
				errorMessage={$licenseValidationErrors.renewalInterval}
			/>
		</div>
	{/if}
</div>

<style>
	.expiration-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.expiration-label {
		margin-bottom: 0.4rem;
	}

	.required {
		color: red;
	}

	.expiration-row {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.date-picker {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		appearance: none;
		box-sizing: border-box;
		flex-grow: 1;
	}

	.date-picker:hover {
		border: 1px dashed black;
		cursor: pointer;
		padding: 0 0 0 0.5rem;
	}

	.date-picker-add-mode {
		border: 1px dashed black;
		padding: 0 0 0 0.5rem;
	}

	.date-picker:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		appearance: auto;
		padding: 0 0 0 0.5rem;
	}

	.date-picker:required:invalid {
		color: gray;
		appearance: auto;
	}

	.renewal-checkbox {
		margin-top: 0.2rem;
		margin-left: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 7rem;
		font-size: 0.8rem;
		margin-bottom: 0.2rem;
		flex-shrink: 0;
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

	.cost-field {
		margin-top: 1.4rem;
		width: 100%;
	}

	.interval-field {
		margin-top: 1.4rem;
		width: 100%;
	}

	input[type='checkbox'] {
		width: 1.1rem;
		height: 1.1rem;
		cursor: pointer;
		accent-color: var(--deep-purple);
		transition: background-color 0.2s ease;
	}

	input[type='checkbox']:focus-visible {
		outline: 2px solid var(--light-purple);
	}

	@media (max-width: 1000px) {
		.renewal-checkbox {
			margin-left: 0.6rem;
		}
	}
</style>
