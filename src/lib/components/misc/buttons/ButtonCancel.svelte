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
		style:background={`linear-gradient(to right, red 100%, transparent 100%`}
	/>
</div>

<style>
	.button-container {
		position: relative;
		height: 3rem;
		min-width: 6rem;
		padding: 1rem 1.3rem;
		display: flex;
		box-sizing: border-box;
		border: 1px solid black;
		background-color: transparent;
		user-select: none;
		cursor: pointer;
		align-items: center;
		justify-content: center;
    transition: border-color 0.25s ease, color 0.25s ease;
	}

	.button-container:hover .button-title {
		color: white; /* Change text color to white on hover */
	}

  .button-container:hover {
    border-color: red; /* Change border color to red on hover */
}

	.button-container .button-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		transition: width 0.25s ease;
	}

	.button-container:hover .button-animated-hover {
		width: 100%;
	}

	.button-content {
		z-index: 1;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button-title {
		color: rgb(0, 0, 0);
		margin-top: 2px;
		text-wrap: nowrap;
		overflow: hidden;
	}

	.button-container:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	h3 {
		cursor: pointer;
	}
</style>
