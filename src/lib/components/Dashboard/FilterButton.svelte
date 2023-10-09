<script lang="ts">
	export let title: string;
	export let amount: number
</script>

<div class="filter-container">
	<div class="filter-content">
		<h4 class="filter-title">{title}</h4>
		<h4 class="filter-amount">{amount}</h4>
	</div>
</div>

<style>
	.filter-container {
		cursor: pointer;
		display: flex;
		border: 1px solid black;
		box-sizing: border-box;
		height: 3.3rem;
		width: 100%;
	}

	.filter-content {
		display: flex;
		width: 100%;
		align-content: space-between;
		justify-content: space-between;
	}

	.filter-title {
    margin: 0.5rem 0 0 0.8rem;
    align-self: flex-start;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
}

	.filter-amount {
		display: flex;
		align-self: flex-end;
		font-size: 1.5rem;
		margin-top: 2.5rem;
		margin: 0 0.8rem 0.1rem 0;
	}
</style>
