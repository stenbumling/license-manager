<script lang="ts">
	export let title: string = 'Button title';
</script>

<div class="button-container">
	<div class="button-content">
		<h3 class="button-title">{title}</h3>
		<img src={'./button-arrow.svg'} alt="arrow" />
	</div>
	<div class="button-animated-hover" />
</div>

<style>
	.button-container {
		display: flex;
		background-color: black;
		color: white;
		height: 3rem;
		box-sizing: border-box;
		padding: 1rem 1.3rem;
		position: relative;
		user-select: none;
	}

	.button-container .button-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		background: linear-gradient(to right, var(--deep-purple) 50%, transparent 50%);
		transition: width 0.25s ease;
	}

	.button-container:hover .button-animated-hover {
		width: 200%;
	}

	.button-content {
		z-index: 1;
		display: flex;
		width: 100%;
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
</style>
