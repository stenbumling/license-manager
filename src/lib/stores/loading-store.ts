import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

function getInitialValues(defaultLoadingState = false) {
	return {
		isLoading: defaultLoadingState,
		pendingOperations: 0,
		timerId: null,
		error: '',
	};
}

interface RequestState {
	isLoading: boolean;
	pendingOperations: number;
	timerId: number | null;
	error: string;
}

export const tableFetchRequest = writable<RequestState>(getInitialValues(true));
export const licenseFetchRequest = writable<RequestState>(getInitialValues());
export const licensePostRequest = writable<RequestState>(getInitialValues());
export const userFetchRequest = writable<RequestState>(getInitialValues());
export const applicationFetchRequest = writable<RequestState>(getInitialValues());
export const applicationPostRequest = writable<RequestState>(getInitialValues());

function createLoadingController() {
	function startLoadingState(loadingStore: Writable<RequestState>, delay = 100) {
		loadingStore.update((state) => {
			const newState = {
				...state,
				error: '',
				pendingOperations: state.pendingOperations + 1,
			};
			if (state.pendingOperations === 0) {
				newState.timerId = setTimeout(
					() => loadingStore.update((s) => ({ ...s, isLoading: true })),
					delay,
				);
			}
			return newState;
		});
	}

	function endLoadingState(loadingStore: Writable<RequestState>) {
		loadingStore.update((state) => {
			state.pendingOperations = state.pendingOperations - 1;
			if (state.pendingOperations <= 0) {
				if (state.timerId !== null) {
					clearTimeout(state.timerId);
				}
				return {
					...state,
					isLoading: false,
					pendingOperations: 0,
					timerId: null,
					error: state.error,
				};
			}
			return state;
		});
	}

	function setError(loadingStore: Writable<RequestState>, errorMessage: string) {
		loadingStore.update((state) => ({ ...state, error: errorMessage }));
	}

	return {
		start: startLoadingState,
		end: endLoadingState,
		setError,
	};
}

export const loadingState = createLoadingController();
