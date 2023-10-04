<script>
	import { goto } from '$app/navigation';

	function addNewLicense() {
		goto('/add-new-license');
	}
</script>

<button class="button-container" on:click={addNewLicense}>
	<h3>Add new license</h3>
</button>

<style>
	.button-container {
		cursor: pointer;
		display: flex;
		align-items: center;
		background-color: black;
		color: white;
		height: 3rem;
		width: 100%;
		margin-top: 1.5rem;
		padding: 0.5rem 1.3rem;
	}

	h3 {
		margin-top: 2px;
	}
</style>
