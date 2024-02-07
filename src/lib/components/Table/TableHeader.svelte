<script lang="ts">
	import { sortState, table } from '$lib/stores/table-store';
	import CaretDown from 'carbon-icons-svelte/lib/CaretDown.svelte';
	import CaretUp from 'carbon-icons-svelte/lib/CaretUp.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
	import { browser } from '$app/environment';

	// Firefox doesn't support scrollbar-width
	let isFirefox = false;
	if (browser) {
		isFirefox = navigator.userAgent.includes('Firefox')
	}
</script>

<div role="rowgroup">
	<div role="row" class="table-header-row" class:extra-margin={!isFirefox}>
		<div role="columnheader" tabindex="-1" class="status-col">
			<CircleDash size={20} />
		</div>
		<div class="application-col">
			<div
				role="columnheader"
				tabindex="0"
				on:click={() => table.sortBy('application')}
				on:keydown|stopPropagation={(e) => {
					if (e.key === 'Enter') {
						table.sortBy('application');
					}
				}}
			>
				<h3 class="column-label">Application</h3>
			</div>
			{#if $sortState['application'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['application'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</div>
		<div class="contact-col">
			<div
				role="columnheader"
				tabindex="0"
				on:click={() => table.sortBy('contactPerson')}
				on:keydown|stopPropagation={(e) => {
					if (e.key === 'Enter') {
						table.sortBy('contactPerson');
					}
				}}
			>
				<h3 class="column-label">Contact person</h3>
			</div>
			{#if $sortState['contactPerson'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['contactPerson'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</div>
		<div class="users-col">
			<div
				role="columnheader"
				tabindex="0"
				on:click={() => table.sortBy('users')}
				on:keydown|stopPropagation={(e) => {
					if (e.key === 'Enter') {
						table.sortBy('users');
					}
				}}
			>
				<h3 class="column-label">Users</h3>
			</div>
			{#if $sortState['users'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['users'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
		</div>
		<div class="expiration-col">
			{#if $sortState['expirationDate'] === 'ASC'}<CaretUp size={24} fill="#5a1ea0" />{/if}
			{#if $sortState['expirationDate'] === 'DESC'}<CaretDown size={24} fill="#5a1ea0" />{/if}
			<div
				role="columnheader"
				tabindex="0"
				on:click={() => table.sortBy('expirationDate')}
				on:keydown|stopPropagation={(e) => {
					if (e.key === 'Enter') {
						table.sortBy('expirationDate');
					}
				}}
			>
				<h3 class="column-label">Expires in</h3>
			</div>
		</div>
		<div role="columnheader" class="renewal-col" />
		<div class="menu-col" />
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.extra-margin {
		margin-right: 1rem;
	}

	.table-header-row {
		display: flex;
		align-items: flex-end;
		padding: 0 0rem 1rem 0;
	}

	.table-header-row > * {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.table-header-row > * > * {
		min-width: 0;
	}

	.column-label {
		cursor: pointer;
		border-radius: 6px;
		user-select: none;
		padding: 2px 0.4rem 1px 0.4rem;
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
		padding: 0 0 4px 0;
	}

	.application-col {
		flex: 2;
	}

	.contact-col {
		flex: 2;
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

	@media (max-width: 1450px) {
		.renewal-col {
			display: none;
		}

		.expiration-col {
			padding-right: 1rem;
		}
	}
</style>
