<script lang="ts">
	import LicensRow from '$lib/components/table/LicenseRow.svelte';
</script>

<tbody class="table">
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
	<LicensRow />
</tbody>

<style>
	.table {
		min-height: 30.4rem;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow-y: auto;
		scrollbar-gutter: stable both-edges;
	}

	.table > :global(:last-child) {
		border-bottom: none;
	}
</style>
