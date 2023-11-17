<script lang="ts">
	export let title: string = 'Cancel';
	export let action: (e: any) => void;
</script>

<div
	role="button"
	tabindex="0"
	class="button-container"
	on:click|preventDefault={action}
	on:keydown={(e) => {
		if (e.key === 'Enter') {
			action(e);
		}
	}}
>
	<div class="button-content">
		<h3 class="button-title">{title}</h3>
	</div>
	<div
		class="button-animated-hover"
		style:background={`linear-gradient(to right, black 100%, transparent 100%`}
	/>
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
		min-width: 6rem;
		padding: 1rem 1.3rem;
		transition: border-color 0.25s ease, color 0.25s ease;
	}

	/* Styles for the Animated Hover Effect */
	.button-container .button-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 0;
		transition: width 0.25s ease;
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
</style>
