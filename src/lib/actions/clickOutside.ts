// This simply handle clicks outside of the element it is attached to.

export function clickOutside(node: HTMLElement, callback: (event: MouseEvent) => void) {
	function handleClick(event: MouseEvent) {
		// Check if the click was outside the node and not prevented
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			callback(event);
		}
	}

	// Capture phase set to true to handle events before they reach the target
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		},
	};
}
