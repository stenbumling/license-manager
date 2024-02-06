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

	<div style:margin-left={dismissible ? '1rem' : '2.9rem'}>
		{#if dismissible}
			<CloseModalButton action={handleDismiss} color={type === 'warning' ? 'black' : 'white'} />
		{/if}
	</div>
</article>

<style>
	article {
		color: white;
		padding: 0.75rem 0.5rem 0.75rem 1rem;
		border-radius: 0.3rem;
		box-shadow: 0.2rem 0.2rem 0.3rem rgba(0, 0, 0, 0.35);
		display: flex;
		align-items: center;
		margin: 0 0 0.8rem 0;
		min-height: 2rem;
		max-width: 23rem;
	}

	.success {
		background: rgb(97, 155, 92);
		border: 2px solid rgba(0, 0, 0, 0.15);
	}

	.info {
		background: rgb(92, 92, 92);
		border: 2px solid rgba(0, 0, 0, 0.15);
	}

	.warning {
		background: #f0bf0e;
		border: 2px solid rgba(0, 0, 0, 0.15);
		color: black;
	}

	.alert {
		background: rgb(203, 55, 55);
		border: 2px solid rgba(0, 0, 0, 0.15);
	}

	.text {
		margin-right: auto;
		display: flex;
		word-break: break-word;
	}

	.icon-container {
		display: flex;
		margin-right: 1rem;
	}
</style>
