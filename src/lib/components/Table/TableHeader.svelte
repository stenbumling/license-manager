<script lang="ts">
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
</script>

<thead>
	<tr>
		<th class="status-col">
			<CircleDash size={20} />
		</th>
		<th class="application-col">
			<h3>Application</h3>
		</th>
		<th class="contact-col">
			<h3>Contact person</h3>
		</th>
		<th class="assigned-col">
			<h3>Assigned</h3>
		</th>
		<th class="expiration-col">
			<h3>Expires in</h3>
		</th>
		<th class="renewal-col" />
		<th class="menu-col" />
	</tr>
</thead>

<style>
	* {
		box-sizing: border-box;
	}

	tr {
		overflow-y: scroll;
		border-bottom: 2px solid black;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		padding: 0 0rem 1rem 0;
	}

	tr::-webkit-scrollbar {
		background-color: transparent;
	}

	th {
		display: flex;
		height: 3rem;
		align-items: flex-end;
	}

	.status-col {
		flex: 0 0 60px;
		justify-content: center;
		padding: 0 0 0.15rem 0;
	}

	.application-col {
		flex: 2;
		justify-content: flex-start;
	}

	.contact-col {
		flex: 2;
		justify-content: flex-start;
	}

	.assigned-col {
		flex: 1;
		justify-content: center;
	}

	.expiration-col {
		flex: 2;
		justify-content: flex-end;
	}

	.renewal-col {
		flex: 0 0 70px;
		justify-content: center;
	}

	.menu-col {
		flex: 0 0 80px;
		justify-content: center;
	}
</style>
