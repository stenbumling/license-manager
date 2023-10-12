<script lang="ts">
	import { Button } from 'flowbite-svelte';

	function handleClick() {
		console.log('clicked');
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
		<Button class="p-2 ml-5 w-12 h-11 cursor-pointer bg-[var(--deep-purple)]" on:click={handleClick}>O</Button>
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
		align-items: flex-end;
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
</style>
