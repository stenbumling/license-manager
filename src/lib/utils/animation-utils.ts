import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

// Used for animating user badges
export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 200),

	fallback(node) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 200,
			easing: quintOut,
			css: (t) => `
      transform: ${transform} scale(${t});
      opacity: ${t}
    `,
		};
	},
});
