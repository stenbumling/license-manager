/**
 * Simple delay function to pause execution for a given amount of time. Useful
 * for testing or adding purposeful delays to things like loading spinners or
 * animations.
 *
 * Usage: await delay(x);
 * @param ms - The number of milliseconds to pause execution for.
 */
export async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
