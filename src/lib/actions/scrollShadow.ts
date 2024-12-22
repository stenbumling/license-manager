/**
 * This Svelte action adds a shadow indicator to scrollable div elements.
 * It keeps track of the scroll position and adds a shadow to the top and bottom of the div
 * where appropriate.
 * 
 * Note: Currently not used in the table, as the background color of even rows
 * obscure the shadow and makes it look glitchy.
 * 
 * @param node - The div element to attach the scroll shadow to.
 * 
 * @example <div use:scrollShadow></div>
 * @see {@link https://svelte.dev/docs/svelte/svelte-action} on how to use Svelte actions.
 */
export function scrollShadow(node: HTMLDivElement) {
	/** The buffer for scroll position to update shadow */
	const tolerance = 1;
	/** The height of the shadow */
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

	/** Updates the shadow based on the scroll position */
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
