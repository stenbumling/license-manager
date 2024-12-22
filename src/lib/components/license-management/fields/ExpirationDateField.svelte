<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import ToggleButton from '$lib/components/misc/buttons/ToggleButton.svelte';
	import { currentLicense, licenseMode } from '$lib/stores/resources/license-store';
	import type { ToggleButtonItem } from '$lib/types/misc-types';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import { licenseValidationErrors } from '$lib/validations/license-validation';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	$: daysLeftUntilExpirationDate = getRelativeDate($currentLicense.expirationDate);
	$: startIndexForToggleButtonItems = toggleButtonItems.findIndex(
		(item) => item.label === $currentLicense.renewalInterval,
	);

	const id = uuidv4();

	const toggleButtonItems: ToggleButtonItem[] = [
		{
			label: 'None',
			icon: Repeat,
			action: () => ($currentLicense.renewalInterval = 'Monthly'),
		},
		{
			label: 'Monthly',
			icon: Repeat,
			action: () => ($currentLicense.renewalInterval = 'Annually'),
			class: 'active',
		},
		{
			label: 'Annually',
			icon: Repeat,
			action: () => ($currentLicense.renewalInterval = 'None'),
			class: 'active',
		},
	];
</script>

<div class="expiration-date-container">
	<h3 class="field-label">
		<label for={id}
			>{$currentLicense.renewalInterval !== 'None' ? 'Renewal date' : 'Expiration date'}</label
		>
		<span class="required">*</span>
	</h3>

	<div class="input-row">
		<input
			class="date-picker"
			class:date-picker-add-mode={$licenseMode === 'add'}
			type="date"
			required
			{id}
			name="expirationDate"
			bind:value={$currentLicense.expirationDate}
		/>
		<div
			use:tooltip={{
				content: 'Toggle to change renewal interval',
				options: { delay: [200, 0], offset: [0, 15] },
			}}
		>
			<ToggleButton index={startIndexForToggleButtonItems} items={toggleButtonItems} />
		</div>
	</div>

	<p class="helper-text">
		{#if $licenseValidationErrors.expirationDate}
			<span class="error-text" in:fade={{ duration: 120 }}
				>{$licenseValidationErrors.expirationDate}</span
			>
		{:else}
			<span in:fade={{ duration: 120 }}>{daysLeftUntilExpirationDate.text}</span>
		{/if}
	</p>
</div>

<style>
	.expiration-date-container {
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

	.required,
	.error-text {
		color: red;
	}

	.input-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.date-picker {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		appearance: none;
		box-sizing: border-box;
		width: 100%;
		margin-right: 1.4rem;
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

	.helper-text {
		font-size: 0.75rem;
		color: var(--text-placeholder);
		height: 2.8rem;
		margin-left: 1px;
	}
</style>
