<header class="header-container">
	<div class="header-content">
		<a href="/" data-sveltekit-reload>
			<h1 class="header-title">License manager</h1>
		</a>
		<div class="header-subtitle-badge">
			<h2 class="header-subtitle">Demo version</h2>
		</div>
	</div>
</header>

<style>
	.header-container {
		padding: 0 4.9rem 0 5.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-black);
		height: 4.65rem;
	}
	.header-content {
		width: 100%;
		gap: 1.6rem;
		max-width: 96rem;
		display: flex;
		align-items: center;
	}

	.header-title {
		color: var(--color-white);
		cursor: pointer;
		user-select: none;
		margin: 0;
		transition: color 0.15s ease;
	}

	.header-title:hover {
		color: var(--color-secondary-purple);
	}

	.header-title:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.header-subtitle-badge {
		display: flex;
		background-color: var(--color-white);
		border-radius: 6px;
		padding: 3px 10px;
	}

	.header-subtitle {
		display: flex;
		font-size: 0.8rem;
		margin: 0;
		color: var(--color-black);
	}

	@media (max-height: 850px) {
		.header-container {
			height: 3.3rem;
		}

		.header-content {
			gap: 0.8rem;
		}

		.header-title {
			font-size: 1.25rem;
		}

		.header-subtitle-badge {
			background-color: var(--color-black);
		}

		.header-subtitle {
			font-size: 0.7rem;
			color: #a5a5a5;
		}
	}
</style>
