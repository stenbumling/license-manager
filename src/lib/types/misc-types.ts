import type { FilterReadableName } from '$lib/types/query-types';
import type { ComponentType } from 'svelte';

export interface DashboardFilter {
	title: FilterReadableName;
	amount: number;
	color: string;
}

export interface ContextMenuState {
	position: { top: number; left: number } | null;
	activeId: string | null;
}

export interface ContextMenuItem {
	label: string;
	action: () => void;
	icon?: ComponentType;
	class?: 'warning' | 'alert';
}

export interface NewNotification {
	message: string;
	type: 'success' | 'info' | 'warning' | 'alert';
	dismissable?: boolean;
	timeout?: number | false;
}

export interface Notification extends NewNotification {
	id: string;
}

export interface RequestState {
	isLoading: boolean;
	pendingRequests: number;
	startTime: number;
	delayTimer: NodeJS.Timeout | undefined;
	delay: number;
	error: App.Error | null;
}
