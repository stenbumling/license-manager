import { delay } from '$lib/utils/delay';
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

export interface RequestState {
	isLoading: boolean;
	pendingRequests: number;
	startTime: number;
	delayTimer: NodeJS.Timeout | undefined;
	delay: number;
	error: App.Error | null;
}

function getInitialStateValues(defaultLoadingState = false) {
	return {
		isLoading: defaultLoadingState,
		pendingRequests: 0,
		startTime: 100,
		delayTimer: undefined,
		delay: 0,
		error: null,
	};
}

// Stores for different types of requests.
export const tableFetchRequest = writable<RequestState>(getInitialStateValues(true));
export const licenseFetchRequest = writable<RequestState>(getInitialStateValues());
export const licensePostRequest = writable<RequestState>(getInitialStateValues());
export const licenseDeleteRequest = writable<RequestState>(getInitialStateValues());
export const userFetchRequest = writable<RequestState>(getInitialStateValues());
export const applicationFetchRequest = writable<RequestState>(getInitialStateValues());
export const applicationPostRequest = writable<RequestState>(getInitialStateValues());
export const applicationDeleteRequest = writable<RequestState>(getInitialStateValues());

export const disabledButtons = writable<boolean>(false);

function createRequestStateController() {
	/**
	 * Set the loading state to true and show the loading spinner after a optional delay
	 * @param request A request state store to update
	 * @param {number} [delay] The minimum time to wait before showing the loading spinner
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
	 * @param {number} [minLoadingTime=0] - The minimum time the loading spinner should be shown, if it was shown
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

	function setError(request: Writable<RequestState>, error: App.Error) {
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
