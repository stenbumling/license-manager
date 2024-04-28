type DateStatus = 'ok' | 'warning' | 'alert' | 'invalid';

export function getTodaysDate(): string {
	const currentDate = new Date().toISOString().split('T')[0];
	return currentDate;
}

export function cleanUpDateString(unformattedDate: string): string {
	const date = new Date(unformattedDate);
	return date.toLocaleString('sv-SE').slice(0, 16);
}

export function daysUntil(date: string): number {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const targetDate = new Date(date);
	targetDate.setHours(0, 0, 0, 0);

	const timeDiff = targetDate.getTime() - today.getTime();
	const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
	return diffDays;
}

export function getRelativeDate(date: string): {
	text: string;
	status: DateStatus;
} {
	const diffDays = daysUntil(date);
	let text = 'No date selected';
	let status: DateStatus = 'ok';

	if (Number.isNaN(diffDays)) {
		text = 'No date selected';
		status = 'alert';
	} else if (diffDays === 0) {
		text = 'today';
		status = 'alert';
	} else if (diffDays === 1) {
		text = 'tomorrow';
		status = 'warning';
	} else if (diffDays === -1) {
		text = 'yesterday';
		status = 'alert';
	} else if (diffDays > 1 && diffDays < 15) {
		text = `In ${diffDays} days`;
		status = 'warning';
	} else if (diffDays > 0) {
		text = `In ${diffDays} days`;
	} else {
		text = `${Math.abs(diffDays)} days ago`;
		status = 'alert';
	}

	return { text, status };
}
