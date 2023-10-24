<script lang="ts">
	import Search from 'carbon-icons-svelte/lib/Search.svelte';
</script>

<input class="search-field" type="text" placeholder="Search" />
<div class="search-icon">
	<Search size={20} fill="black" aria-label="Search" />
</div>

<style>
	.search-icon {
		position: relative;
		top: -35px;
		left: 14px;
		width: 20px;
	}

	.search-field {
		width: 100%;
		height: 3rem;
		padding-left: 50px;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		background-color: transparent;
	}

	input:hover {
		padding: 0 0 1px 49px;
		border: 1px dashed black;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding: 0 0 1px 48px;
	}
</style>
