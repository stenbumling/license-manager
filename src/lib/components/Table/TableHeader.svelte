<script lang="ts">
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
</script>

<thead class="table-header-container">
	<tr>
		<th>
			<CircleDash size={20} />
		</th>
		<th>
			<h3>Application</h3>
		</th>
		<th>
			<h3>Contact person</h3>
		</th>
		<th>
			<h3>Assigned</h3>
		</th>
		<th>
			<h3>Expires in</h3>
		</th>
		<th />
	</tr>
</thead>

<style>
	tr {
		scrollbar-gutter: stable both-edges;
		overflow-y: auto;
		padding: 1.05rem 2rem;
		border-bottom: 2px solid black;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	thead th:nth-child(1) {
		width: 5%;
		height: 1.6rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	thead th:nth-child(2) {
		width: 35%;
		height: 1.6rem;
		align-items: center;
		display: flex;
		justify-content: flex-start;
	}

	thead th:nth-child(3) {
		width: 25%;
		height: 1.6rem;
		align-items: center;
		display: flex;
		justify-content: flex-start;
	}

	thead th:nth-child(4) {
		width: 10%;
		height: 1.6rem;
		align-items: center;
		display: flex;
		justify-content: center;
	}

	thead th:nth-child(5) {
		width: 20%;
		height: 1.6rem;
		align-items: center;
		display: flex;
		justify-content: flex-end;
	}

	thead th:nth-child(6) {
		width: 5%;
		display: flex;
		justify-content: center;
	}
</style>
