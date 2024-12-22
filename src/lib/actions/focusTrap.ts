import type { Options } from 'focus-trap';
import { createFocusTrap } from 'focus-trap';

/**
 * This Svelte action traps the tab focus within the element it is attached to. It is simply a
 * wrapper that utilizes the [focus-trap](https://github.com/focus-trap/focus-trap) library.
 * @param node - The element to attach the focus trap to.
 * @param options - The [options](https://github.com/focus-trap/focus-trap?tab=readme-ov-file#usage) to pass to the focus-trap library.
 *
 * @example <div use:focusTrap={{ <your options> }}></div>
 * @see {@link https://github.com/focus-trap/focus-trap}
 * @see {@link https://svelte.dev/docs/svelte/svelte-action} on how to use Svelte actions.
 */
export function focusTrap(
	node: HTMLElement,
	options: Options = { fallbackFocus: node, escapeDeactivates: false, allowOutsideClick: true },
) {
	const focusTrappedElement = createFocusTrap(node, options);
	focusTrappedElement.activate();

	return {
		destroy() {
			focusTrappedElement.deactivate();
		},
	};
}
