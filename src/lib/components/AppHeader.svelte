<header class="header-container">
	<div class="header-content">
		<a style="line-height:0" href="/" data-sveltekit-reload>
			<h1 class="header-title">License manager</h1>
		</a>
		<div class="header-subtitle-badge">
			<h2 class="header-subtitle">Demo version</h2>
		</div>
	</div>
</header>

<style>
	.header-container {
		padding: 1rem 4.9rem 1rem 5.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-deep-black);
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
		color: var(--color-white);
		margin: 0;
	}

	.header-subtitle-badge {
		display: flex;
		background-color: var(--color-deep-purple);
		border-radius: 6px;
		padding: 3px 0.8rem;
	}

	.header-subtitle {
		display: flex;
		font-size: 0.9rem;
		margin: 0;
		color: #e0beff;
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

		.header-subtitle-badge {
			background-color: var(--color-deep-black);
		}

		.header-subtitle {
			font-size: 0.7rem;
			color: var(--color-light-purple);
		}
	}
</style>
