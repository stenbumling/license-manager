<script lang="ts">
	import type { License } from '$lib/stores/license-store';

	export let license: License;
</script>

<tr class="license-row-container">
	<td><p>o</p></td>
	<td><p class="table-text">{license.application}</p></td>
	<td><p class="table-text">{license.contactPerson}</p></td>
	<td><p class="table-text">5</p></td> 
	<td><p class="table-text">{license.renewalDate}</p></td>
	<!-- <td><p class="table-text">...</p></td> -->
</tr>

<style>
	* {
		box-sizing: border-box;
	}

	.license-row-container {
		min-height: 3rem;
		height: 3rem;
		padding: 0 2rem;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
		align-items: center;
	}

	.table-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	tr td:nth-child(1) {
		width: 5%;
		display: flex;
		justify-content: flex-start;
		padding: 0 2rem 0 0;
	}

	tr td:nth-child(2) {
		width: 35%;
		display: flex;
		justify-content: flex-start;
		padding: 0 2rem 0 0;
	}

	tr td:nth-child(3) {
		width: 25%;
		display: flex;
		justify-content: flex-start;
		padding: 0 2rem 0 0;
	}

	tr td:nth-child(4) {
		width: 10%;
		display: flex;
		justify-content: center;
		/* padding: 0 0 0 2rem; */
	}

	tr td:nth-child(5) {
		width: 20%;
		display: flex;
		justify-content: flex-end;
		padding: 0 0 0 2rem;
	}

	tr td:nth-child(6) {
		width: 5%;
		display: flex;
		justify-content: center;
		/* border-left: 1px black solid; */
		/* padding: 0 2rem 0 0; */
	}
</style>
