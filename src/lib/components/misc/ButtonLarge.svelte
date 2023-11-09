<script lang="ts">
	export let title: string = 'Button title';
</script>

<div class="button-container">
	<div class="button-content">
		<h3 class="button-title">{title}</h3>
		<img src={'/button-arrow.svg'} alt="arrow" />
	</div>
	<div class="button-animated-hover" 		style:background={`linear-gradient(to right, var(--deep-purple) 100%, transparent 100%`} />
</div>

<style>
	.button-container {
		position: relative;
		height: 3rem;
		padding: 1rem 1.3rem;
		display: flex;
		box-sizing: border-box;
		color: white;
		background-color: black;
		user-select: none;
		cursor: pointer;
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
		justify-content: space-between;
	}

	.button-title {
		margin-top: 2px;
		margin-right: 1rem;
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
