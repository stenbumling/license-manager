/*
 * Simple delay function to pause execution for a given amount of time. Useful
 * for testing in async functions.
 * Usage: await delay(1000);
 */

export async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
