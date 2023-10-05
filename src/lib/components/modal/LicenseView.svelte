<script lang="ts">
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.ts';

	function goBack() {
		goto('/');
		showModal.set(false);
	}
</script>

<h1>Add new license</h1>
<a href="/" on:click|preventDefault={goBack}>Go back</a>
