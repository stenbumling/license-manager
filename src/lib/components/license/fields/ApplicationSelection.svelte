<script lang="ts">
	import { applicationStore } from '$lib/stores/application-store';
	import { license, licenseErrors } from '$lib/stores/license-store';
	import { showApplicationModal } from '$lib/stores/modal-state';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';

	function handleClick() {
		showApplicationModal.set(true);
	}

	function handleApplicationChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const selectedAppId = target.value;
		const foundApp = $applicationStore.find((app) => app.id === selectedAppId);
		$license.application.name = foundApp ? foundApp.name : '';
	}
</script>

<div class="application-selection-container">
	<h3 class="application-selection-label">Application</h3>
	<div class="application-selection-row">
		<select
			required
			name="applications"
			bind:value={$license.applicationId}
			on:change={handleApplicationChange}
		>
			<option disabled selected hidden value="">Select a application</option>
			{#each $applicationStore as application}
				<option value={application.id}>{application.name}</option>
			{/each}
		</select>
		<button class="settings-button" on:click={handleClick}>
			<SettingsAdjust size={20} fill="white" aria-label="SettingsAdjust" />
		</button>
	</div>
	<div class="helper-text">
		{#if $licenseErrors.applicationId}
			<p>{$licenseErrors.applicationId.message}</p>
		{/if}
	</div>
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
	}

	.helper-text {
		margin-bottom: 0.4rem;
		font-size: 0.75rem;
		color: #ff0000;
	}

	.settings-button {
		height: 75%;
		aspect-ratio: 1/1;
		margin-left: 1.6rem;
		border-radius: 6px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: var(--deep-purple);
		}

		&:active {
			position: relative;
			top: 1px;
			left: 1px;
		}
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
	}

	select:hover {
		padding: 0.3rem;
		border: 1px dashed black;
		cursor: pointer;
		appearance: auto;
	}

	select:focus {
		padding: 0.3rem;
		border: 2px solid var(--light-purple);
		outline: none;
		appearance: auto;
	}

	select:required:invalid {
		color: gray;
		appearance: auto;
	}

	option[value=''][disabled] {
		display: none;
	}

	option {
		font-style: normal;
		color: black;
	}

	@media (max-width: 1000px) {
		.settings-button {
			margin-left: 0.6rem;
		}
	}
</style>
