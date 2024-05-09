<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} - {$page.error?.type}</title>
</svelte:head>

<div class="error-container">
	<h1>{$page.status}</h1>
	<div class="error-details">
		{#if $page.status === 404}
			<h2>
				The requested web page at
				<span style="color:var(--deep-purple)">{$page.url.pathname}</span> could not be found.
			</h2>
			{#if $page.error?.details}
				<p>{$page.error.details}</p>
			{/if}
		{:else}
			<h2>{$page.error?.message}</h2>
			<p>
				The server encountered an internal error or misconfiguration and was unable to complete your
				request. Please try again later, or contact support if the problem persists.
			</p>
		{/if}
	</div>
</div>

<style>
	.error-container {
		height: calc(100vh - 4.65rem);
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		max-width: 80%;

		& > h1 {
			font-size: 5rem;
		}
	}

	.error-details {
		max-width: 62ch;
		word-wrap: break-word;
	}

	@media (max-height: 850px) {
		.error-container {
			height: calc(100vh - 3.3rem);
		}
	}
</style>
