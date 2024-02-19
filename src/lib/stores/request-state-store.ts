import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

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

function getInitialValues(defaultLoadingState = false) {
	return {
		isLoading: defaultLoadingState,
		pendingRequests: 0,
		delayTimer: null,
		error: {
			code: 418, // Initialized with this to prevent "no licenses" message or instant loading spinner on app start
			type: '',
			message: '',
		},
	};
}

interface RequestState {
	isLoading: boolean;
	pendingRequests: number;
	delayTimer: number | null;
	error: {
		code: number | null;
		type: string;
		message: string;
	};
}

// Stores for different types of requests.
export const tableFetchRequest = writable<RequestState>(getInitialValues(true));
export const licenseFetchRequest = writable<RequestState>(getInitialValues());
export const licensePostRequest = writable<RequestState>(getInitialValues());
export const userFetchRequest = writable<RequestState>(getInitialValues());
export const applicationFetchRequest = writable<RequestState>(getInitialValues());
export const applicationPostRequest = writable<RequestState>(getInitialValues());

function createRequestStateController() {
	function setRequestState(request: Writable<RequestState>, delay = 200) {
		request.update((state) => {
			if (state.pendingRequests === 0) {
				// Create a delay before setting the loading state
				const timer = setTimeout(() => request.update((s) => ({ ...s, isLoading: true })), delay);
				return {
					...state,
					// Reset error state when loading starts
					error: {
						code: null,
						type: '',
						message: '',
					},
					pendingRequests: state.pendingRequests + 1,
					delayTimer: timer,
				};
			} else {
				return {
					...state,
					pendingRequests: state.pendingRequests + 1,
				};
			}
		});
	}

	function endRequestState(request: Writable<RequestState>) {
		request.update((state) => {
			state.pendingRequests = Math.max(0, state.pendingRequests - 1); // Prevent negative values
			if (state.pendingRequests === 0) {
				if (state.delayTimer) {
					clearTimeout(state.delayTimer);
				}
				return {
					...state,
					isLoading: false,
					delayTimer: null,
				};
			}
			return state;
		});
	}

	function setError(
		request: Writable<RequestState>,
		errorCode: number | null,
		errorType: string,
		errorMessage: string,
	) {
		request.update((state) => ({
			...state,
			error: { code: errorCode, type: errorType, message: errorMessage },
		}));
	}

	return {
		startLoading: setRequestState,
		endLoading: endRequestState,
		setError,
	};
}

export const request = createRequestStateController();
