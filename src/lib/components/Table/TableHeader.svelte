<script lang="ts">
	import { sortState, table } from '$lib/stores/table-store';
	import CaretDown from 'carbon-icons-svelte/lib/CaretDown.svelte';
	import CaretUp from 'carbon-icons-svelte/lib/CaretUp.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
</script>

<div role="rowgroup">
	<div role="row" class="header-row">
		<div role="columnheader" tabindex="0" class="status-col">
			<CircleDash size={20} />
		</div>
		<div
			role="columnheader"
			tabindex="0"
			class="application-col"
			on:click={() => table.sortBy('application')}
			on:keydown={() => table.sortBy('application')}
		>
			<h3 class="column-label">Application</h3>
			{#if $sortState['application'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['application'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</div>
		<div
			role="columnheader"
			tabindex="0"
			class="contact-col"
			on:click={() => table.sortBy('contactPerson')}
			on:keydown={() => table.sortBy('contactPerson')}
		>
			<h3 class="column-label">Contact person</h3>
			{#if $sortState['contactPerson'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['contactPerson'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</div>
		<div
			role="columnheader"
			tabindex="0"
			class="users-col"
			on:click={() => table.sortBy('users')}
			on:keydown={() => table.sortBy('users')}
		>
			<h3 class="column-label">Users</h3>
			{#if $sortState['users'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['users'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</div>
		<div
			role="columnheader"
			tabindex="0"
			class="expiration-col"
			on:click={() => table.sortBy('renewalDate')}
			on:keydown={() => table.sortBy('renewalDate')}
		>
			{#if $sortState['renewalDate'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['renewalDate'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
			<h3 class="column-label">Expires in</h3>
		</div>
		<div role="columnheader" tabindex="0" class="renewal-col" />
		<div class="menu-col" />
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.header-row {
		overflow-y: scroll;
		border-bottom: 2px solid black;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		padding: 0 0rem 1rem 0;
	}

	::-webkit-scrollbar {
		background-color: transparent;
	}

	.status-col,
	.application-col,
	.contact-col,
	.users-col,
	.expiration-col,
	.renewal-col,
	.menu-col {
		display: flex;
		align-items: center;
		min-width: 0;
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
