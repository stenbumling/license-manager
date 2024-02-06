<script lang="ts">
	import logo from '$lib/images/nexer-logo-white.png';
</script>

<header class="header-container">
	<div class="header-content">
		<img class="header-logo" src={logo} alt="Nexer Logo" />
		<h2 class="header-department-name">Örebro</h2>
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

	.header-logo {
		height: 1.6rem;
	}

	.header-content {
		width: 100%;
		height: 2.4rem;
		gap: 1.6rem;
		max-width: 116rem;
		display: flex;
		align-items: center;
	}

	.header-department-name {
		display: flex;
		margin-top: 2px;
		color: #a3a3a3;
	}

	@media (max-height: 850px) {
		.header-container {
			padding: 0.3rem 4.9rem 0.3rem 5.1rem;
		}

		.header-content {
			gap: 1rem;
		}

		.header-logo {
			height: 1rem;
		}

		.header-department-name {
			font-size: 0.7rem;
		}
	}
</style>
