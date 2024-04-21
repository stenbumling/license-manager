<script lang="ts">
	import { disableButtonsDuringRequests } from '$lib/stores/request-state-store';

	export let title: string = 'Button title';
	export let action: (e: MouseEvent | KeyboardEvent) => void;

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			action(e);
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	class:disabled={$disableButtonsDuringRequests}
	class="button-container"
	on:click|preventDefault={action}
	on:keydown={handleKeyDown}
>
	<div class="button-content">
		<h3 class="button-title">{title}</h3>
	</div>
	<div class="button-animated-hover" />
</div>

<style>
	.button-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		user-select: none;
		cursor: pointer;
		background-color: transparent;
		border: 1px solid black;
		height: 3rem;
		min-width: 8rem;
		padding: 1rem 1.3rem;
		transition: border-color 0.25s ease, color 0.25s ease;
	}

	.button-container .button-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 0;
		transition: width 0.25s ease;
		background: linear-gradient(to right, var(--deep-purple) 100%, transparent 100%);
	}

	.button-container:hover {
		border: 1px solid var(--deep-purple);
	}

	.button-container:hover .button-title {
		color: white;
	}

	.button-container:hover .button-animated-hover {
		width: 100%;
	}

	.button-content {
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.button-title {
		color: rgb(0, 0, 0);
		margin-top: 2px;
		overflow: hidden;
		text-wrap: nowrap;
		cursor: pointer;
	}

	.button-container:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
