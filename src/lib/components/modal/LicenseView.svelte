<script>
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/modal.js';

	function goBack() {
		goto('/');
		showModal.set(false);
	}
</script>

<h1>Add new license</h1>
<!--TODO: Remove link when replaced by a close button-->
<a href="/" on:click|preventDefault={goBack}>Go back</a>
