export function getElementRect(node: Element, callback: (arg0: DOMRect) => void) {
  
	const observer = new ResizeObserver((entries) => {
		if (entries[0].target === node) {
			const rect = entries[0].target.getBoundingClientRect();
			callback(rect);
		}
	});

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
			observer.disconnect();
		},
	};
}
