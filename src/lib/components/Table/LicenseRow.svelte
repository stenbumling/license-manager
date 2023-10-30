<script lang="ts">
	import type { License } from '$lib/stores/license-store';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';

	export let license: License;

	$: renewalDate = getRelativeDate(license.renewalDate);
</script>

<tr class="license-row-container">
	<td class="icon-cell">
		<div
			class="status-icon"
			class:inactive={license.status === 'Inactive'}
			class:expired={license.status === 'Expired'}
		/>
	</td>
	<td class="application-cell">
		<p class="table-text">{license.application}</p>
	</td>
	<td class="contact-cell">
		<p class="table-text">{license.contactPerson}</p>
	</td>
	<td class="assigned-cell">
		<p class="table-text">5</p>
	</td>
	<td class="expiration-cell">
		<p
			class="table-text"
			class:warning-text={renewalDate.status === 'warning'}
			class:alert-text={renewalDate.status === 'alert'}
		>
			{renewalDate.text}
		</p>
	</td>
	<td class="renewal-cell">
		<Repeat size={16} />
	</td>
	<td class="menu-cell">
		<div class="vertical-line" />
		<div class="menu-button">
			<OverflowMenuHorizontal size={32} />
		</div>
	</td>
</tr>

<style>
	* {
		box-sizing: border-box;
	}

	.license-row-container {
		min-height: 3.6rem;
		height: 3.6rem;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		align-items: center;
	}

	.status-icon {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: #6ae674;
	}

	.inactive {
		background-color: #bfbfbf;
	}

	.expired {
		background-color: #ff0000;
	}

	.table-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.warning-text {
		color: #ff9736;
		font-weight: bold;
	}

	.alert-text {
		color: #ff0000;
		font-weight: bold;
	}

	.vertical-line {
		border-left: 1px solid #d1d0d0;
		margin: 0 1.4rem 0 1rem;
	}

	@media (max-width: 1400px) {
		.vertical-line {
			border: none;
		}
	}

	.menu-button {
		display: flex;
		align-items: center;
		transition: color 0.25s ease;
		transition: background-color 0.2s ease;
		border-radius: 6px;
	}

	.menu-button:hover {
		background-color: #cfcfcf;
	}

	/* Table cells */

	td {
		display: flex;
	}

	.icon-cell {
		width: 7%;
		justify-content: center;
	}

	.application-cell {
		width: 30%;
		justify-content: flex-start;
	}

	.contact-cell {
		width: 25%;
		justify-content: flex-start;
	}

	.assigned-cell {
		width: 10%;
		justify-content: center;
	}

	.expiration-cell {
		width: 14%;
		justify-content: flex-end;
	}

	.renewal-cell {
		width: 5%;
		justify-content: center;
	}

	.menu-cell {
		width: 7%;
		justify-content: flex-end;
	}
</style>
