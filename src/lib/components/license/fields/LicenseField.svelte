<script lang="ts">
	import { Select, Label } from 'flowbite-svelte';
	let countries = [
		{ value: 'us', name: 'United States' },
		{ value: 'ca', name: 'Canada' },
		{ value: 'fr', name: 'France' },
	];
</script>

<div class="field-container">
	<div class="field">
		<Label for="select-underline" class="sr-only">Underline select</Label>
		<Select id="select-underline" underline class="mt-2" items={countries} />
	</div>
</div>

<style>
	.field-container {
		display: flex;
		/* border: 1px solid black; */
		/* min-height: 16rem; */
		/* min-width: 33.33%; */
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.field {
		width: 80%;
	}
</style>
