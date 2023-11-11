export function scrollShadow(node: HTMLDivElement) {
	const tolerance = 1;
	const shadowHeight = 8; // Height of the shadow in pixels

	// Initially set the background with both shadows, but invisible
	node.style.background = `
			linear-gradient(white, rgba(255, 255, 255, 0)) center top / 100% ${shadowHeight}px,
			linear-gradient(rgba(255, 255, 255, 0), white) center bottom / 100% ${shadowHeight}px,
			radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top / 100% ${shadowHeight}px,
			radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center bottom / 100% ${shadowHeight}px
	`;
	node.style.backgroundRepeat = 'no-repeat';
	node.style.backgroundAttachment = 'local, local, scroll, scroll';

	function updateShadow() {
		const isScrollable = node.scrollHeight > node.clientHeight + tolerance;
		const isScrolledToTop = node.scrollTop <= tolerance;
		const isScrolledToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - tolerance;

		if (!isScrollable) {
			// No shadows if not scrollable
			node.style.backgroundImage = 'none';
		} else {
			// Adjust the opacity of the top and bottom shadows
			const topShadowOpacity = isScrolledToTop ? 0 : 1;
			const bottomShadowOpacity = isScrolledToBottom ? 0 : 1;

			node.style.backgroundImage = `
							linear-gradient(white, rgba(255, 255, 255, ${topShadowOpacity * 0})),
							linear-gradient(rgba(255, 255, 255, 0), white),
							radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, ${topShadowOpacity * 0.2}), rgba(0, 0, 0, 0)),
							radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, ${
								bottomShadowOpacity * 0.2
							}), rgba(0, 0, 0, 0))
					`;
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
