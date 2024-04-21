<script lang="ts">
	import { focusTrap } from '$lib/actions/focusTrap';
	import UserBadge from '$lib/components/license/fields/UserBadge.svelte';
	import CloseModalButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { modal } from '$lib/stores/modal-store';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import { receive, send } from '$lib/utils/animation-utils.ts';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
</script>

<!-- This modal shows all assigned users when there are more than 8 users -->
<div class="modal-container" transition:fade={{ duration: 120 }}>
	<dialog open class="modal-window" use:focusTrap>
		<div class="modal-header">
			<h1 class="modal-title">Assigned<br />users</h1>
			<CloseModalButton action={modal.closeAssignedUsers} />
		</div>
		<h3>List of assigned users</h3>
		<div class="badge-container">
			{#each $currentLicense.users as user (user.id)}
				<div
					in:receive={{ key: user.id }}
					out:send={{ key: user.id }}
					animate:flip={{ duration: 200 }}
				>
					<UserBadge {user} />
				</div>
			{/each}
			{#if $currentLicense.users.length === 0}
				<p>No users assigned.</p>
			{/if}
		</div>
	</dialog>
</div>

<style>
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
	}

	.modal-window {
		width: 40vw;
		max-width: 30rem;
		min-height: 25vh;
		max-height: 50vh;
		padding: 3rem 4rem;
		border: none;
		display: flex;
		flex-direction: column;
		align-self: center;
		background-color: white;
	}

	.modal-header {
		margin: 0 0 3rem 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.modal-title {
		margin: 0;
		font-size: 2rem;
	}

	.badge-container {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	h3 {
		margin-bottom: 0.4rem;
	}
</style>
