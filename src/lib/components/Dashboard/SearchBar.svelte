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
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		border: none;
		width: 100%;
		height: 3rem;
		background-color: transparent;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		padding-left: 50px;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 49px;
		padding-bottom: 2px;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding-left: 48px;
		padding-bottom: 2px;
	}
</style>
