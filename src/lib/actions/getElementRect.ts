export function getElementRect(node: Element, callback: (arg0: DOMRect) => void) {
	// Observes and returns the bounding rectangle of the given node when it changes
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

	// Listen for window resize events and debounces them if too frequent
	let debounceTimeout: number | undefined;

	function debounce(
		func: (...args: unknown[]) => void,
		delay: number,
	): (...args: unknown[]) => void {
		let debounceTimeout: number | undefined;

		return function (this: unknown, ...args: unknown[]) {
			clearTimeout(debounceTimeout);
			debounceTimeout = window.setTimeout(() => func(...args), delay);
		};
	}
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
