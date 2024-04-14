/**
 Returns a formatted date string in the format 'YYYY-MM-DD'. It will return the current date by default, but you can pass an offset in days to get a date in the past or future.
*/
export function getFormattedDate(offsetDays = 0) {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);
	date.setUTCDate(date.getUTCDate() + offsetDays);
	return date.toISOString().split('T')[0];
}
