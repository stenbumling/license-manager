<script>
	import CloseButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { CheckmarkOutline, Information, Warning, WarningFilled } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let type = 'info';
	export let dismissable = true;

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

	<div style:margin-left={dismissable ? '1rem' : '2.9rem'}>
		{#if dismissable}
			<CloseButton
				action={handleDismiss}
				color={type === 'warning' ? 'black' : 'white'}
				parentType="notification"
			/>
		{/if}
	</div>
</article>

<style>
	article {
		color: white;
		padding: 1.05rem 0.8rem 1.15rem 1rem;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3),
			0px -3px 0px inset rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		margin: 0 0 0.8rem 0;
		min-height: 2rem;
		width: 23rem;
	}

	.success {
		background-color: #20b65c;
		border: 1px solid rgba(0, 0, 0, 0.15);
		color: rgb(255, 255, 255);
	}

	.info {
		background-color: rgb(92, 92, 92);
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.warning {
		background-color: #f0bf0e;
		border: 1px solid rgba(0, 0, 0, 0.15);
		color: black;
	}

	.alert {
		background-color: #d32d2d;
		border: 1px solid rgba(0, 0, 0, 0.15);
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
