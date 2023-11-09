export function scrollShadow(node: HTMLDivElement) {
	const tolerance = 1;
	function updateShadow() {
		const isScrollable = node.scrollHeight > node.clientHeight + tolerance;
		const isScrolledToTop = node.scrollTop <= tolerance;
		const isScrolledToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - tolerance;
		if (!isScrollable) {
			node.style.boxShadow = '';
		} else if (isScrolledToTop) {
			node.style.boxShadow = 'inset 0 -6px 4px -4px rgba(0,0,0,0.2)';
		} else if (isScrolledToBottom) {
			node.style.boxShadow = 'inset 0 6px 4px -4px rgba(0,0,0,0.2)';
		} else {
			node.style.boxShadow =
				'inset 0 6px 4px -4px rgba(0,0,0,0.2), inset 0 -6px 4px -4px rgba(0,0,0,0.2)';
		}
	}

	updateShadow();
	node.addEventListener('scroll', updateShadow);

	return {
		destroy() {
			node.removeEventListener('scroll', updateShadow);
		},
	};
}
