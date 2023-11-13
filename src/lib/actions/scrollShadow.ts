export function scrollShadow(node: HTMLDivElement) {
	const tolerance = 1;
	const shadowHeight = 8;

	node.style.background = `
        linear-gradient(white, rgba(255, 255, 255, 0)) center top / 100% ${shadowHeight}px,
        linear-gradient(rgba(255, 255, 255, 0), white) center bottom / 100% ${shadowHeight}px,
        radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) center top / 100% ${shadowHeight}px,
        radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) center bottom / 100% ${shadowHeight}px
    `;
	node.style.backgroundRepeat = 'no-repeat';
	node.style.backgroundAttachment = 'local, local, scroll, scroll';
	node.style.transition = `background-image 0.3s ease`;

	function updateShadow() {
		const isScrolledToTop = node.scrollTop <= tolerance;
		const isScrolledToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - tolerance;

		const topShadowOpacity = isScrolledToTop ? 0 : 1;
		const bottomShadowOpacity = isScrolledToBottom ? 0 : 1;

		node.style.backgroundImage = `
            linear-gradient(white, rgba(255, 255, 255, 0)),
            linear-gradient(rgba(255, 255, 255, 0), white),
            radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, ${
							topShadowOpacity * 0.2
						}), rgba(0, 0, 0, 0)),
            radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, ${
							bottomShadowOpacity * 0.2
						}), rgba(0, 0, 0, 0))
        `;
	}

	updateShadow();
	node.addEventListener('scroll', updateShadow);

	return {
		destroy() {
			node.removeEventListener('scroll', updateShadow);
		},
	};
}
