export function daysUntil(date: string): number {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const targetDate = new Date(date);
	targetDate.setHours(0, 0, 0, 0);

	const timeDiff = targetDate.getTime() - today.getTime();
	const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
	return diffDays;
}

export function getRelativeDate(date: string): { text: string; warning: boolean } {
	const diffDays = daysUntil(date);
	let text = 'Invalid date';
	let warning = false;

	if (Number.isNaN(diffDays)) {
		text = 'Invalid date';
	} else if (diffDays === 0) {
		text = 'today';
	} else if (diffDays === 1) {
		text = 'tomorrow';
	} else if (diffDays === -1) {
		text = 'yesterday';
	} else if (diffDays > 0) {
		text = `In ${diffDays} days`;
		console.log(diffDays);
	} else {
		text = `${Math.abs(diffDays)} days ago`;
		warning = true;
	}

	if (diffDays < 14) {
		warning = true;
	}

	return { text, warning };
}
