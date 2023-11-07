<script lang="ts">
	import CaretDown from 'carbon-icons-svelte/lib/CaretDown.svelte';
	import CaretUp from 'carbon-icons-svelte/lib/CaretUp.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';

	type SortState = 'asc' | 'desc' | 'none';

	let sortStates: Record<string, SortState> = {
		application: 'none',
		contact: 'none',
		assigned: 'none',
		expires: 'none',
	};

	function handleSort(column: string) {
		if (sortStates[column] === 'none') {
			for (let key in sortStates) {
				sortStates[key] = 'none';
			}
		}

		switch (sortStates[column]) {
			case 'none':
				sortStates[column] = 'asc';
				break;
			case 'asc':
				sortStates[column] = 'desc';
				break;
			case 'desc':
				sortStates[column] = 'none';
				break;
		}
	}
</script>

<thead>
	<tr>
		<th class="status-col" on:click={() => {}}>
			<CircleDash size={20} />
		</th>
		<th class="application-col" on:click={() => handleSort('application')}>
			<h3 class="column-label">Application</h3>
			{#if sortStates['application'] === 'asc'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortStates['application'] === 'desc'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</th>
		<th class="contact-col" on:click={() => handleSort('contact')}>
			<h3 class="column-label">Contact person</h3>
			{#if sortStates['contact'] === 'asc'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortStates['contact'] === 'desc'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</th>
		<th class="assigned-col" on:click={() => handleSort('assigned')}>
			<h3 class="column-label">Assigned</h3>
			{#if sortStates['assigned'] === 'asc'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortStates['assigned'] === 'desc'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</th>
		<th class="expiration-col" on:click={() => handleSort('expires')}>
			{#if sortStates['expires'] === 'asc'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortStates['expires'] === 'desc'}<CaretDown size={24} fill="#5a1ea0" />{/if}
			<h3 class="column-label">Expires in</h3>
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
		align-items: center;
		min-width: 0;
	}

	th > * {
		margin-top: 1px;
	}

	.column-label {
		cursor: pointer;
		border-radius: 6px;
		user-select: none;
		padding: 0.1rem 0.4rem 0 0.4rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.column-label:hover {
		background-color: #eeeeee;
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
		flex: 1.5;
		justify-content: center;
	}

	.expiration-col {
		flex: 1.5;
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
