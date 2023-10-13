<script lang="ts">
	import { showServiceModal } from '$lib/stores/modal.ts';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';

	function handleClick() {
		showServiceModal.set(true);
	}
</script>

<div class="field-container">
	<h3 class="field-label">Service</h3>
	<div class="field-row">
		<select required name="services">
			<option disabled selected hidden value="">Select a service</option>
			<option value="office-365">Office 365</option>
			<option value="autocad">AutoCAD</option>
			<option value="docker-enterprise">Docker Enterprise</option>
			<option value="visual-studio-enterprise">Visual Studio Enterprise</option>
		</select>
		<button class="settings-button" on:click={handleClick}>
			<SettingsAdjust size={20} fill="white" aria-label="SettingsAdjust" />
		</button>
	</div>
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

	.field-row {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.settings-button {
		height: 75%;
		aspect-ratio: 1/1;
		border-radius: 6px;
		background-color: black;
		margin-left: 1.6rem;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;

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
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid black;
		appearance: none;
		box-sizing: border-box;
	}

	select:hover {
		border: 1px dashed black;
		cursor: pointer;
		appearance: auto;
		padding: 0.3rem;
	}

	select:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		appearance: auto;
		padding: 0.3rem;
	}

	select:required:invalid {
		color: gray;
		font-style: italic;
		appearance: auto;
	}

	option[value=''][disabled] {
		display: none;
	}

	option {
		color: black;
		font-style: normal;
	}

	@media (max-width: 1000px) {
		.settings-button {
			margin-left: 0.6rem;
		}
	}
</style>
