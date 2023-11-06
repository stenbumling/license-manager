export function getElementRect(node: Element, callback: (arg0: DOMRect) => void) {
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
	window.addEventListener('resize', () => callback(node.getBoundingClientRect()));

	return {
		destroy() {
			observer.unobserve(node);
			observer.disconnect();
		},
	};
}
