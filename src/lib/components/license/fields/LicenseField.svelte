<script lang="ts">
	export let content: string;
</script>

<div class="field-container">
	<p>{content}</p>
</div>

<style>
	.field-container {
		display: flex;
		border: 1px solid black;
		/* min-height: 16rem; */
		/* min-width: 33.33%; */
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}
</style>
