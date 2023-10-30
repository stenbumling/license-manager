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
		<th />
	</tr>
</thead>

<style>
	* {
		box-sizing: border-box;
	}
	tr {
		scrollbar-gutter: stable;
		overflow-y: auto;
		border-bottom: 2px solid black;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		padding: 0 0 1rem 0;
	}

	thead th {
		display: flex;
		height: 3rem;
		align-items: flex-end;
	}

	thead th:nth-child(1) {
		width: 7%;
		justify-content: center;
		padding: 0 0 0.15rem 0;
	}

	thead th:nth-child(2) {
		width: 30%;
		justify-content: flex-start;
	}

	thead th:nth-child(3) {
		width: 25%;
		justify-content: flex-start;
	}

	thead th:nth-child(4) {
		width: 10%;
		justify-content: center;
	}

	thead th:nth-child(5) {
		width: 14%;
		justify-content: flex-end;
	}

	thead th:nth-child(6) {
		width: 5%;
		justify-content: center;
	}

	thead th:nth-child(7) {
		width: 7%;
		justify-content: center;
	}
</style>
