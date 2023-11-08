<script lang="ts">
	import { searchQuery, table } from '$lib/stores/table-store';
	import CaretDown from 'carbon-icons-svelte/lib/CaretDown.svelte';
	import CaretUp from 'carbon-icons-svelte/lib/CaretUp.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
	import { get } from 'svelte/store';

	type SortState = 'ASC' | 'DESC' | '';

	let sortOrder: Record<string, SortState> = {
		application: '',
		contactPerson: '',
		users: '',
		renewalDate: '',
	};

	function handleSort(column: string) {
		if (sortOrder[column] === '') {
			for (let key in sortOrder) {
				sortOrder[key] = '';
			}
		}

		switch (sortOrder[column]) {
			case '':
				sortOrder[column] = 'ASC';
				break;
			case 'ASC':
				sortOrder[column] = 'DESC';
				break;
			case 'DESC':
				sortOrder[column] = '';
				break;
		}
		const currentSearchQuery = get(searchQuery);
		table.sort(column, sortOrder[column], currentSearchQuery);
	}
</script>

<thead>
	<tr>
		<th class="status-col" on:click={() => {}}>
			<CircleDash size={20} />
		</th>
		<th class="application-col" on:click={() => handleSort('application')}>
			<h3 class="column-label">Application</h3>
			{#if sortOrder['application'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortOrder['application'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</th>
		<th class="contact-col" on:click={() => handleSort('contactPerson')}>
			<h3 class="column-label">Contact person</h3>
			{#if sortOrder['contactPerson'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortOrder['contactPerson'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</th>
		<th class="users-col" on:click={() => handleSort('users')}>
			<h3 class="column-label">Users</h3>
			{#if sortOrder['users'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortOrder['users'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</th>
		<th class="expiration-col" on:click={() => handleSort('renewalDate')}>
			{#if sortOrder['renewalDate'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if sortOrder['renewalDate'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
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
		padding: 0 0 0.2rem 0;
	}

	.application-col {
		flex: 2;
		justify-content: flex-start;
	}

	.contact-col {
		flex: 2;
		justify-content: flex-start;
	}

	.users-col {
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
