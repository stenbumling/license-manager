import type { FilterReadableName } from '$lib/types/query-types';
import type { ComponentType } from 'svelte';

export type WarningModalMode =
	| 'closed'
	| 'license-deletion'
	| 'license-deactivation'
	| 'application-deletion'
	| 'unsaved-license-changes';

export interface DashboardFilter {
	title: FilterReadableName;
	amount: number;
	color: string;
}

export interface ContextMenuState {
	position: { adjustedTop: number; adjustedLeft: number } | null;
	activeId: string | null;
}

export interface ContextMenuItem {
	label: string;
	action: () => void;
	icon?: ComponentType;
	class?: 'warning' | 'alert';
}

export interface ToggleButtonItem {
	label: string;
	action: () => void;
	icon?: ComponentType;
	class?: 'active';
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
