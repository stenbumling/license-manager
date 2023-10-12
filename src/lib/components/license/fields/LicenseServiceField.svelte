<script lang="ts">
</script>

<div class="field-container">
	<select required name="services">
		<option disabled selected hidden value="">Select a service</option>
		<option value="office-365">Office 365</option>
		<option value="autocad">AutoCAD</option>
		<option value="docker-enterprise">Docker Enterprise</option>
		<option value="visual-studio-enterprise">Visual Studio Enterprise</option>
	</select>
</div>

<style>
	.field-container {
		display: flex;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	select {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3.2rem;
		background-color: transparent;
		border-bottom: 1px solid black;
		appearance: none;
		box-sizing: border-box;
		padding: 0rem;
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
</style>
