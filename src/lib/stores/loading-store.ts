import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

function getInitialValues(defaultLoadingState = false) {
	return {
		isLoading: defaultLoadingState,
		counter: 0,
		timerId: null,
	};
}

interface RequestState {
	isLoading: boolean;
	counter: number;
	timerId: number | null;
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
			if (state.counter === 0) {
				state.timerId = setTimeout(
					() => loadingStore.update((s) => ({ ...s, isLoading: true })),
					delay,
				);
			}
			return { ...state, counter: state.counter + 1 };
		});
	}

	function endLoadingState(loadingStore: Writable<RequestState>) {
		loadingStore.update((state) => {
			state.counter = state.counter - 1;
			if (state.counter <= 0) {
				if (state.timerId !== null) {
					clearTimeout(state.timerId);
				}
				return { isLoading: false, counter: 0, timerId: null };
			}
			return state;
		});
	}

	return {
		start: startLoadingState,
		end: endLoadingState,
	};
}

export const loadingState = createLoadingController();
