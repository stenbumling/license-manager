<script lang="ts">
	import ModalTitle from '$lib/components/modal/ModalTitle.svelte';
	import FieldComponent from '$lib/components/modal/FieldComponent.svelte';
</script>

<div class="view-container">
	<ModalTitle />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
	<FieldComponent />
</div>

<style>
	.view-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		justify-content: flex-end;
		width: 100%;
		max-width: 120rem;
		height: 100%;
		overflow-y: auto;
	}

	@media (max-width: 1600px) {
		.view-container {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
