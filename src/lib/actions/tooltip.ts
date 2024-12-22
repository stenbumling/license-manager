import type { Instance, Props } from 'tippy.js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface TooltipParams {
	content: string;
	options?: Partial<Props>;
}

interface SvelteAction {
	update: (newParams: TooltipParams) => void;
	destroy: () => void;
}

/**
 * This Svelte action adds a tooltip for a given element by utilizing the [tippy.js](https://atomiks.github.io/tippyjs/) library.
 * @param node - The element to attach the tooltip to.
 * @param params - The content of the tooltip and the [options](https://atomiks.github.io/tippyjs/v6/all-props/) to pass to the tippy library.
 * @example <div use:tooltip={{ content: 'Tooltip content', options: { placement: 'right' } }}></div>
 * @see {@link https://atomiks.github.io/tippyjs/}
 * @see {@link https://svelte.dev/docs/svelte/svelte-action} on how to use Svelte actions.
 */
export function tooltip(node: HTMLElement, params: TooltipParams): SvelteAction {
	let instance: Instance | null = null;

	/** If the content is not empty and the instance is not created, create a new instance */
	function createOrUpdateTooltip() {
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
