<script lang="ts">
	import Notification from '$lib/components/misc/Notification.svelte';
	import { notifications } from '$lib/stores/notification-store';
</script>

{#if $notifications.length > 0}
	<section>
		{#each $notifications as notification (notification.id)}
			<Notification
				type={notification.type}
				dismissible={notification.dismissible}
				on:dismiss={() => notifications.dismiss(notification.id)}
				>{notification.message}
			</Notification>
		{/each}
	</section>
{/if}

<style>
	section {
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		margin: 2rem 2.4rem;
		flex-direction: column;
		z-index: 1000;
	}
</style>
