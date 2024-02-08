import type { Options } from 'focus-trap';
import { createFocusTrap } from 'focus-trap';

/*
 * This traps the tab focus within the element it is applied to. It is simply an
 * action wrapper that uses the focus-trap library – read more at https://github.com/focus-trap/focus-trap on usage and options.
 */

export function focusTrap(
	node: HTMLElement,
	options: Options = { fallbackFocus: node, escapeDeactivates: false },
) {
	const focusTrappedElement = createFocusTrap(node, options);
	focusTrappedElement.activate();

	return {
		destroy() {
			focusTrappedElement.deactivate();
		},
	};
}
