<script lang="ts">
	export let value: string = '';
</script>

<div class="application-selection-container">
	<h3 class="application-selection-label">Expiration date</h3>
	<div class="application-selection-row">
		<input class="date-picker" type="date" required name="applications" bind:value />
		<div class="renewal-checkbox">
			<input type="checkbox" id="renewal" name="renewal" value="renewal" />
			<label for="renewal">Autorenewal</label>
		</div>
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

	.renewal-checkbox {
		margin-left: 1.4rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 10rem;
		font-size: 0.8rem;
		margin-bottom: 0.2rem;
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

	.date-picker {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		appearance: none;
		box-sizing: border-box;
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

	@media (max-width: 1000px) {
		.renewal-checkbox {
			margin-left: 0.6rem;
		}
	}
</style>
