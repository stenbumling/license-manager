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

interface RequestState {
	isLoading: boolean;
	pendingRequests: number;
	delayTimer: NodeJS.Timeout | undefined;
	error: App.Error;
}

function getInitialStateValues(defaultLoadingState = false) {
	return {
		isLoading: defaultLoadingState,
		pendingRequests: 0,
		delayTimer: undefined,
		error: defaultError,
	};
}
const defaultError: App.Error = { status: null, type: '', message: '' };

// Stores for different types of requests.
export const tableFetchRequest = writable<RequestState>(getInitialStateValues(true));
export const licenseFetchRequest = writable<RequestState>(getInitialStateValues());
export const licensePostRequest = writable<RequestState>(getInitialStateValues());
export const userFetchRequest = writable<RequestState>(getInitialStateValues());
export const applicationFetchRequest = writable<RequestState>(getInitialStateValues());
export const applicationPostRequest = writable<RequestState>(getInitialStateValues());

const loadingSpinner = writable<{ startTime: number; delay: number }>({ startTime: 0, delay: 0 });

function createRequestStateController() {
	function setRequestState(request: Writable<RequestState>, delay = 200) {
		loadingSpinner.set({ startTime: Date.now(), delay: delay });

		request.update((state) => {
			if (state.pendingRequests === 0) {
				return {
					...state,
					pendingRequests: state.pendingRequests + 1,
					delayTimer: setTimeout(() => request.update((s) => ({ ...s, isLoading: true })), delay),
					error: defaultError,
				};
			} else {
				return {
					...state,
					pendingRequests: state.pendingRequests + 1,
				};
			}
		});
	}

	async function endRequestState(request: Writable<RequestState>, minLoadingTime = 1000) {
		// If loading spinner is shown, wait for a minimum time before removing it
		const elapsedTime = Date.now() - get(loadingSpinner).startTime;
		const delayedTime = elapsedTime < get(loadingSpinner).delay ? 0 : minLoadingTime;
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
