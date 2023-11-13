<script lang="ts">
	import CloseModalButton from '$lib/components/misc/CloseModalButton.svelte';
	import { license, licenseMode } from '$lib/stores/license-store';
	import { modal } from '$lib/stores/modal-store';

</script>

<div class="header-container">
	<div class="header-content">
		{#if $license.application.name && $licenseMode === 'view'}
			<h1 class="title">{$license.application.name}</h1>
		{:else}
			<h1 class="title new-license">New license</h1>
		{/if}
		<CloseModalButton action={modal.closeLicense} />
	</div>
</div>

<style>
	.header-container {
		border-bottom: 1px solid var(--text-placeholder);
		display: flex;
		flex-direction: column;
	}

	.header-content {
		margin-bottom: 0.4rem;
		display: flex;
		justify-content: space-between;
	}

	.title {
		margin-bottom: 1rem;
		font-size: 2.8rem;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 90%;
	}

	.new-license {
		color: var(--text-placeholder);
	}
</style>
