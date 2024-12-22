/**
 * This Svelte action handle clicks outside of the element it is attached to.
 * @param node - The element to attach the click outside handler to.
 * @param callback - The function to call when a click outside the element occurs.
 *
 * @example <div use:clickOutside={handleClickOutside}></div>
 * @see {@link https://svelte.dev/docs/svelte/svelte-action} on how to use Svelte actions.
 */
export function clickOutside(node: HTMLElement, callback: (event: MouseEvent) => void) {
	/** Check if the click was outside the node and not prevented */
	function handleClick(event: MouseEvent) {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			callback(event);
		}
	}

	//Capture phase set to true to handle events before they reach the target
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		},
	};
}
