<script lang="ts">
	import { browser } from '$app/environment';
	import { tooltip } from '$lib/actions/tooltip';
	import { sortState, table } from '$lib/stores/resources/table-store';
	import CaretDown from 'carbon-icons-svelte/lib/CaretDown.svelte';
	import CaretUp from 'carbon-icons-svelte/lib/CaretUp.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	// Firefox doesn't support `scrollbar-width`, so we add a margin to the last column instead
	let isFirefox = false;
	if (browser) {
		isFirefox = navigator.userAgent.includes('Firefox');
	}
</script>

<div role="rowgroup">
	<div role="row" class="table-header-row" class:extra-margin={!isFirefox}>
		<!-- Status column -->
		<div
			role="columnheader"
			tabindex="-1"
			class="status-col"
			use:tooltip={{ content: 'Status', options: { delay: [1000, 0] } }}
		>
			<CircleDash size={20} />
		</div>

		<!-- Application column -->
		<div class="application-col">
			<!-- Column label -->
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

			<!-- Sort direction symbol -->
			{#if $sortState['application'] === 'ASC'}
				<div
					style="line-height:0.5; margin-bottom: 0px;"
					in:fly={{ duration: 160, y: 20, easing: quintOut }}
				>
					<CaretUp size={24} fill="#5a1ea0" />
				</div>
			{/if}
			{#if $sortState['application'] === 'DESC'}
				<div
					style="line-height:0.5; margin-bottom: 2px;"
					in:fly={{ duration: 160, y: -20, easing: quintOut }}
					out:fly={{ duration: 160, y: 10, easing: quintOut }}
				>
					<CaretDown size={24} fill="#5a1ea0" />
				</div>
			{/if}
		</div>

		<!-- Contact person column -->
		<div class="contact-col">
			<!-- Column label -->
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

			<!-- Sort direction symbol -->
			{#if $sortState['contactPerson'] === 'ASC'}
				<div
					style="line-height:0.5; margin-bottom: 0px;"
					in:fly={{ duration: 160, y: 20, easing: quintOut }}
				>
					<CaretUp size={24} fill="#5a1ea0" />
				</div>
			{/if}
			{#if $sortState['contactPerson'] === 'DESC'}
				<div
					style="line-height:0.5; margin-bottom: 2px;"
					in:fly={{ duration: 160, y: -20, easing: quintOut }}
					out:fly={{ duration: 160, y: 10, easing: quintOut }}
				>
					<CaretDown size={24} fill="#5a1ea0" />
				</div>
			{/if}
		</div>

		<!-- Users column -->
		<div class="users-col">
			<!-- Column label -->
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

			<!-- Sort direction symbol -->
			{#if $sortState['users'] === 'ASC'}
				<div
					style="line-height:0.5; margin-bottom: 0px;"
					in:fly={{ duration: 160, y: 20, easing: quintOut }}
				>
					<CaretUp size={24} fill="#5a1ea0" />
				</div>
			{/if}
			{#if $sortState['users'] === 'DESC'}
				<div
					style="line-height:0.5; margin-bottom: 2px;"
					in:fly={{ duration: 160, y: -20, easing: quintOut }}
					out:fly={{ duration: 160, y: 10, easing: quintOut }}
				>
					<CaretDown size={24} fill="#5a1ea0" />
				</div>
			{/if}
		</div>

		<!-- Expiration date column -->
		<div class="expiration-col">
			<!-- Sort direction symbol -->
			{#if $sortState['expirationDate'] === 'ASC'}
				<div
					style="line-height:0.5; margin-bottom: 0px;"
					in:fly={{ duration: 160, y: 20, easing: quintOut }}
				>
					<CaretUp size={24} fill="#5a1ea0" />
				</div>
			{/if}
			{#if $sortState['expirationDate'] === 'DESC'}
				<div
					style="line-height:0.5; margin-bottom: 2px;"
					in:fly={{ duration: 160, y: -20, easing: quintOut }}
					out:fly={{ duration: 160, y: 10, easing: quintOut }}
				>
					<CaretDown size={24} fill="#5a1ea0" />
				</div>
			{/if}

			<!-- Column label -->
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

		<!-- Renewal column -->
		<div role="columnheader" class="renewal-col" />

		<!-- Menu column (currently empty) -->
		<div class="menu-col" />
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.extra-margin {
		margin-right: 5px;
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

	/*  Columns */

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
