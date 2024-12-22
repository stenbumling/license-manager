/**
 * This Svelte action continously observes the element it is attached to and returns its dimensions and position when they change.
 * In addition, it listens for window resize events and debounces them if too frequent.
 * @param node - The element to observe.
 * @param arg0 - The callback function that receives the bounding rectangle of the element.
 *
 * @example <div use:getElementRect={callback}></div>
 * @see {@link https://svelte.dev/docs/svelte/svelte-action} on how to use Svelte actions.
 */
export function getElementRect(node: Element, callback: (arg0: DOMRect) => void) {
	/** Observes and returns the bounding rectangle of the given node when it changes */
	const observer = new ResizeObserver((entries) => {
		if (entries[0].target === node) {
			const rect = entries[0].target.getBoundingClientRect();
			const roundedRect = new DOMRect(
				Math.round(rect.x),
				Math.round(rect.y),
				Math.round(rect.width),
				Math.round(rect.height),
			);
			callback(roundedRect);
		}
	});

	observer.observe(node);

	/** The timeout for debouncing the resize event */
	let debounceTimeout: number | undefined;

	/** Debounces the resize event if too frequent */
	function debounce(
		func: (...args: unknown[]) => void,
		delay: number,
	): (...args: unknown[]) => void {
		return function (this: unknown, ...args: unknown[]) {
			clearTimeout(debounceTimeout);
			debounceTimeout = window.setTimeout(() => func(...args), delay);
		};
	}

	/** Debounced resize event */
	const debouncedResize = debounce(() => {
		callback(node.getBoundingClientRect());
	}, 100);

	window.addEventListener('resize', debouncedResize);

	return {
		destroy() {
			observer.unobserve(node);
			observer.disconnect();
			window.removeEventListener('resize', debouncedResize);
			if (debounceTimeout) clearTimeout(debounceTimeout);
		},
	};
}
