<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import IconButton from '$lib/components/misc/buttons/IconButton.svelte';
	import { applicationModalMode } from '$lib/stores/modal-store';
	import { applicationStore } from '$lib/stores/resources/application-store';
	import { license, licenseMode } from '$lib/stores/resources/license-store';
	import { licenseValidationErrors } from '$lib/validations/license-validation';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import { fade } from 'svelte/transition';

	function handleApplicationChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const selectedAppId = target.value;
		const foundApp = $applicationStore.find((app) => app.id === selectedAppId);
		$license.application.name = foundApp ? foundApp.name : '';
		$license.application.link = foundApp ? foundApp.link : '';
	}
</script>

<div class="application-selection-container">
	<h3 class="application-selection-label">Application <span class="required">*</span></h3>
	<div class="application-selection-row">
		<select
			required
			name="applications"
			class:select-add-mode={$licenseMode === 'add'}
			bind:value={$license.applicationId}
			on:change={handleApplicationChange}
		>
			<option disabled selected hidden value="">Select a application</option>
			{#each $applicationStore as application}
				<option value={application.id}>{application.name}</option>
			{/each}
		</select>
		<div
			use:tooltip={{
				content: 'Manage applications',
				options: { delay: [1000, 0], offset: [0, 15] },
			}}
		>
			<IconButton
				icon={SettingsAdjust}
				iconSize={20}
				action={() => applicationModalMode.set('list')}
			/>
		</div>
	</div>
	<p class="application-secondary-text">
		{#if $licenseValidationErrors.applicationId}
			<span class="warning-text" transition:fade={{ duration: 120 }}
				>{$licenseValidationErrors.applicationId}</span
			>
		{:else if $license.application.link}
			<a class="application-link" href={$license.application.link} target="_blank"
				>{$license.application.link.length > 100
					? $license.application.link.slice(0, 100) + '...'
					: $license.application.link}</a
			>
		{/if}
	</p>
</div>

<style>
	.application-selection-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.application-selection-label {
		margin-bottom: 0.4rem;
	}

	.application-selection-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.application-secondary-text {
		font-size: 0.75rem;
		min-height: 2.8rem;
		width: 90%;
		margin-left: 1px;
	}

	.application-link {
		color: var(--deep-purple);

		&:hover {
			text-decoration: underline;
		}
	}

	.required,
	.warning-text {
		color: red;
	}

	select {
		width: 100%;
		height: 3rem;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		background-color: transparent;
		appearance: none;
		margin-right: 1.4rem;
		padding-right: 1rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	select:hover {
		padding: 0 2.5rem 0rem 0.3rem;
		border: 1px dashed black;
		cursor: pointer;
		background-image: url('../../../images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	.select-add-mode {
		padding: 0 2.5rem 0rem 0.3rem;
		border: 1px dashed black;
		background-image: url('../../../images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	select:focus {
		padding: 0 2.5rem 0rem 0.3rem;
		border: 2px solid var(--light-purple);
		outline: none;
		background-image: url('../../../images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	select:required:invalid {
		color: gray;
	}

	option[value=''][disabled] {
		display: none;
	}

	option {
		font-style: normal;
		color: black;
	}
</style>
