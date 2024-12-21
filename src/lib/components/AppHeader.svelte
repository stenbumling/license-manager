<header class="header-container">
	<div class="header-content">
		<a style="line-height:0" href="/" data-sveltekit-reload>
			<h1 class="header-title">License manager</h1>
		</a>
		<h2 class="header-subtitle">Demo</h2>
	</div>
</header>

<style>
	.header-container {
		padding: 1rem 4.9rem 1rem 5.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
	}
	.header-content {
		width: 100%;
		height: 2.8rem;
		gap: 1.6rem;
		max-width: 116rem;
		display: flex;
		align-items: center;
	}

	.header-title {
		color: #ffffff;
		margin: 0;
	}

	.header-subtitle {
		display: flex;
		font-size: 1rem;
		margin: 0;
		color: var(--light-purple);
	}

	@media (max-height: 850px) {
		.header-container {
			padding: 0.3rem 4.9rem 0.3rem 5.1rem;
		}

		.header-content {
			gap: 1rem;
		}

		.header-title {
			font-size: 1.25rem;
		}

		.header-subtitle {
			font-size: 0.7rem;
		}
	}
</style>
