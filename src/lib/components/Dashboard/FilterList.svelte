<script lang="ts">
	import FilterButton from './FilterButton.svelte';
</script>

<div class="filter-list-container">
	<FilterButton />
	<FilterButton />
	<FilterButton />
	<FilterButton />
	<FilterButton />
</div>

<style>
	.filter-list-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 2rem;
	}
</style>
