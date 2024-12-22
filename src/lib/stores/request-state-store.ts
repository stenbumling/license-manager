import type { RequestState } from '$lib/types/misc-types';
import { delay } from '$lib/utils/misc-utils';
import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';

/*
 * This store is used to manage the loading and error states of the
 * requests made in the application.
 * By tracking the number of pending requests, and setting a delay
 * before showing the loading spinner, we can prevent flickering of
 * loading indicators when requests are completed quickly, or when
 * multiple requests are started in quick succession.
 *
 * In the future, loading and error states could be combined with
 * the resource store (e.g. application, license) it is associated
 * with, for a more cohesive state management.
 */

export function getRequestStateDefaultValues(defaultLoadingState = false) {
	return {
		/** Whether the loading spinner should be shown */
		isLoading: defaultLoadingState,
		/** The number of requests currently pending */
		pendingRequests: 0,
		/** The time the first request was made */
		startTime: 100,
		/** The timer for the delay before showing the loading spinner */
		delayTimer: undefined,
		/** The minimum time to wait before showing the loading spinner */
		delay: 0,
		/** The error object returned from the request */
		error: null,
	};
}

// Stores information about the state of the requests made in the application
export const tableFetchRequest = writable<RequestState>(getRequestStateDefaultValues(true));
export const licenseFetchRequest = writable<RequestState>(getRequestStateDefaultValues());
export const licensePostRequest = writable<RequestState>(getRequestStateDefaultValues());
export const licenseDeleteRequest = writable<RequestState>(getRequestStateDefaultValues());
export const userFetchRequest = writable<RequestState>(getRequestStateDefaultValues());
export const applicationFetchRequest = writable<RequestState>(getRequestStateDefaultValues());
export const applicationPostRequest = writable<RequestState>(getRequestStateDefaultValues());
export const applicationDeleteRequest = writable<RequestState>(getRequestStateDefaultValues());

/** Stores the state of the buttons in the application during requests */
export const disableButtonsDuringRequests = writable<boolean>(false);

function createRequestStateController() {
	/**
	 * Set the loading state to true and show the loading spinner after an optional delay
	 * @param request A request state store to update
	 * @param delay The minimum time to wait before showing the loading spinner
	 */
	async function setRequestState(request: Writable<RequestState>, delay: number = 200) {
		request.update((state) => {
			if (state.pendingRequests === 0) {
				return {
					...state,
					pendingRequests: state.pendingRequests + 1,
					startTime: Date.now(),
					delayTimer: setTimeout(() => request.update((s) => ({ ...s, isLoading: true })), delay),
					delay: delay,
					error: null,
				};
			} else {
				return {
					...state,
					pendingRequests: state.pendingRequests + 1,
					startTime: Date.now(),
					delay: delay,
				};
			}
		});
	}

	/**
	 * Set the loading state to false and remove the loading spinner
	 * @param request - A request state store to update
	 * @param minLoadingTime - The minimum time the loading spinner should be shown, if it was shown
	 */
	async function endRequestState(request: Writable<RequestState>, minLoadingTime: number = 0) {
		const elapsedTime = Date.now() - get(request).startTime;
		const delayedTime = elapsedTime < get(request).delay ? 0 : minLoadingTime - elapsedTime;
		await delay(delayedTime);

		request.update((state) => {
			state.pendingRequests = Math.max(0, state.pendingRequests - 1); // Prevent negative values
			if (state.pendingRequests === 0) {
				if (state.delayTimer) {
					clearTimeout(state.delayTimer);
				}
				return {
					...state,
					isLoading: false,
					delayTimer: undefined,
					startTime: 0,
					delay: 0,
				};
			}
			return state;
		});
	}

	/**
	 * Set the error object in the request state so that it can be displayed to the user
	 * @param request - A request state store to update
	 * @param error - The error object to set
	 */
	function setError(request: Writable<RequestState>, error: App.Error | null) {
		request.update((state) => ({
			...state,
			error: error,
		}));
	}

	return {
		startLoading: setRequestState,
		endLoading: endRequestState,
		setError,
	};
}

export const request = createRequestStateController();
