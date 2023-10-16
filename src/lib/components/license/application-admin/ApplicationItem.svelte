<script lang="ts">
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	export let label: string;
</script>

<div class="application-item">
	<p>{label}</p>
	<div class="icon">
		<TrashCan size={24} fill="red" />
	</div>
</div>

<style>
	.application-item {
		width: 100%;
		height: 3rem;
		/* background-color: red; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0.2rem 0;
		border-bottom: 1px solid #E6E6E6;
	}

	.icon {
		width: 2.2rem;
		height: 2.2rem;
		/* background-color: red; */
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
