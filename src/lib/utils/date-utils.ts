import type { DateStatus } from '$lib/types/query-types';

/**
 * Returns a date string in the format 'YYYY-MM-DD'.
 * It will return the current date by default, but you can pass an offset in days to get a date in the past or future.
 @param offsetDays - The number of days to offset the current date by.
*/
export function getTodaysDateWithOffset(offsetDays: number = 0) {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getUTCDate() + offsetDays);
	return date.toISOString().split('T')[0];
}

/**
 * Returns a date string in the format 'YYYY-MM-DD HH:MM',
 * and transforms it to Swedish locale.
 * @param unformattedDate - The date string to format.
 */
export function getDateWithHoursAndMinutes(unformattedDate: Date) {
	const date = new Date(unformattedDate);
	return date.toLocaleString('sv-SE').slice(0, 16);
}

/**
 * Returns a string with a relative date, e.g. 'today', 'tomorrow', 'yesterday', 'In 5 days', '5 days ago'.
 * It also returns a status string that can be used to style the date.
 * @param date - The date string to compare to.
 */
export function getRelativeDate(date: string): {
	text: string;
	status: DateStatus;
} {
	const diffDays = getDiffDays(date);
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

/**
 * Returns a number representing the difference in days between the current date and the target date.
 * @param date
 * @returns
 */
export function getDiffDays(date: string) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const targetDate = new Date(date);
	targetDate.setHours(0, 0, 0, 0);

	const timeDiff = targetDate.getTime() - today.getTime();
	const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
	return diffDays;
}
