<script>
	import { CheckmarkOutline, Information, Warning, WarningFilled } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import CloseModalButton from './buttons/CloseModalButton.svelte';

	const dispatch = createEventDispatcher();

	export let type = 'info';
	export let dismissible = true;

	function handleDismiss() {
		dispatch('dismiss');
	}
</script>

<article class={type} role="alert" in:slide={{ duration: 120 }} out:fade={{ duration: 120 }}>
	<div class="icon-container">
		{#if type === 'success'}
			<CheckmarkOutline size={24} />
		{:else if type === 'info'}
			<Information size={24} />
		{:else if type === 'warning'}
			<Warning size={24} />
		{:else if type === 'alert'}
			<WarningFilled size={24} />
		{/if}
	</div>

	<div class="text">
		<slot />
	</div>

	{#if dismissible}
		<div>
			<CloseModalButton action={handleDismiss} color="white" />
		</div>
	{/if}
</article>

<style>
	article {
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 0rem;
    /* border: 1px solid black; */
		display: flex;
		align-items: center;
		margin: 0 auto 0.5rem auto;
		max-width: 22rem;
	}

	.success {
		background: rgb(97, 155, 92);
	}

	.info {
		background: rgb(154, 156, 158);
	}

	.warning {
		background: #f0bf0e;
	}

	.alert {
		background: rgb(203, 55, 55);
	}

	.text {
		margin-left: 1rem;
		margin-right: 1rem;
		display: flex;
		align-items: center;
	}

	.icon-container {
		display: flex;
    align-content: flex-end;
	}
</style>
