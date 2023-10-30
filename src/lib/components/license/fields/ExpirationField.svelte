<script lang="ts">
	import SelectField from '$lib/components/license/fields/SelectField.svelte';
	import TextField from '$lib/components/license/fields/TextField.svelte';
	import { license } from '$lib/stores/license-store.ts';
	import { getRelativeDate, getTodaysDate } from '$lib/utils/date-utils';
	import { slide } from 'svelte/transition';
	export let value: string = '';
	let autoRenewal = false;
	let label: string = '';

	$: {
		label = autoRenewal ? 'Renewal date' : 'Expiration date';
	}
	$: renewalDate = getRelativeDate($license.renewalDate);
</script>

<div class="expiration-container">
	<h3 class="expiration-label">
		{label}
		<span class="required">*</span>
	</h3>
	<div class="expiration-row">
		<input class="date-picker" type="date" min={getTodaysDate()} required name="applications" bind:value />
		<div class="renewal-checkbox">
			<input
				type="checkbox"
				id="renewal"
				name="renewal"
				value="renewal"
				bind:checked={autoRenewal}
			/>
			<label for="renewal">Autorenewal</label>
		</div>
	</div>
	<div class="secondary-text">
		<p>{renewalDate.text}</p>
	</div>
	<div class="cost-field">
		<TextField
			bind:value={$license.cost}
			label="Cost"
			secondaryText="x kr/year"
			type="secondary"
			placeholder="Enter cost of license"
		/>
	</div>
	{#if autoRenewal}
		<div transition:slide={{ duration: 80 }} class="interval-field">
			<SelectField
				bind:value={$license.renewalInterval}
				label="Renewal interval"
				options={['Monthly', 'Yearly']}
				defaultOption="Monthly"
				required
				type="secondary"
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
		appearance: auto;
		padding: 0.3rem;
	}

	.date-picker:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		appearance: auto;
		padding: 0.3rem;
	}

	.date-picker:required:invalid {
		color: gray;
		appearance: auto;
	}

	.renewal-checkbox {
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
		outline: none;
		transition: background-color 0.2s ease;
	}

	input[type='checkbox']:checked {
		background-color: var(--light-purple);
	}

	@media (max-width: 1000px) {
		.renewal-checkbox {
			margin-left: 0.6rem;
		}
	}
</style>
