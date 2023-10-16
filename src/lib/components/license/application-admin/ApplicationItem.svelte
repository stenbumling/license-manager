<script lang="ts">
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	export let label: string;
</script>

<div class="application-item">
	<div class="icon">
		<TrashCan size={24} fill="red" />
	</div>
	<p>{label}</p>
</div>

<style>
	.application-item {
		width: 100%;
		height: 4rem;
		/* background-color: red; */
		display: flex;
		align-items: center;
		margin: 0 0 0.2rem 0;
		border-bottom: 1px solid #E6E6E6;
	}

	.icon {
		width: 2rem;
		height: 2rem;
		/* background-color: #dd4848; */
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 1rem;
		cursor: pointer;
		position: relative;
		top: -1px;

		&:hover {
			background-color: #ffefef;
		}
	}
</style>
