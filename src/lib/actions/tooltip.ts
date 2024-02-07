import type { Instance, Props } from 'tippy.js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

/*
 * This is a Svelte action that creates a tooltip for a given element. It uses
 * the tippy.js library – read more at https://atomiks.github.io/tippyjs/ on usage
 * and options.
 */

interface TooltipParams {
	content: string;
	options?: Partial<Props>;
}

interface SvelteAction {
	update: (newParams: TooltipParams) => void;
	destroy: () => void;
}

export function tooltip(
	node: HTMLElement,
	params: { content: string; options?: Partial<Props> },
): SvelteAction {
	let instance: Instance | null = null;

	function createOrUpdateTooltip() {
		// If the content is not empty and the instance is not created, create a new instance
		if (params.content && !instance) {
			instance = tippy(node, {
				content: params.content,
				...params.options,
			});
		} else if (instance) {
			instance.setProps({
				content: params.content,
				...params.options,
			});
		}
	}

	createOrUpdateTooltip();

	return {
		update(newParams: { content: string; options?: Partial<Props> }) {
			params = newParams;
			createOrUpdateTooltip();
		},
		destroy() {
			if (instance) {
				instance.destroy();
			}
		},
	};
}
