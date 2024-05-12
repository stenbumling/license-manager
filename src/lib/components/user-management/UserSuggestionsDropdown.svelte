<script lang="ts">
	import { userSuggestions } from '$lib/stores/resources/user-store';
	import { slide } from 'svelte/transition';

	export let handleUserClick: (userName: string) => void;
</script>

<ul role="menu" class="suggestions-list" on:mousedown|preventDefault in:slide={{ duration: 100 }}>
	{#each $userSuggestions as suggestion}
		<li
			role="menuitem"
			tabindex="-1"
			on:mousedown|preventDefault
			on:mouseup={() => handleUserClick(suggestion.name)}
		>
			{suggestion.name}
		</li>
	{/each}
</ul>

<style>
	.suggestions-list {
		list-style-type: none;
		padding: 0;
		margin-top: 0;
		position: absolute;
		background-color: white;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
		width: 100%;
		border: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		max-height: 14rem;
		overflow-y: auto;
	}
	.suggestions-list li {
		padding: 8px 16px;
		cursor: pointer;
	}

	.suggestions-list li:hover {
		background-color: #f0f0f0;
	}
</style>
