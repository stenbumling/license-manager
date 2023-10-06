<script lang="ts">
	import ModalTitle from '$lib/components/modal/ModalTitle.svelte';
	import FieldComponent from '$lib/components/modal/FieldComponent.svelte';
	import ModalButtonContainer from '$lib/components/modal/ModalButtonContainer.svelte';
</script>

<div class="view-container">
	<ModalTitle />
	<div class="fields-container">
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
	<ModalButtonContainer />
</div>

<style>
	.view-container {
		width: 100%;
		max-width: 120rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.fields-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		justify-content: flex-end;
		width: 100%;
		max-width: 120rem;
		height: calc(100% - 12rem);
		overflow-y: auto;
		/* border: 1px solid red; */
	}

	@media (max-width: 1600px) {
		.fields-container {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
