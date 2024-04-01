// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			status: number | null;
			type: string;
			message: string;
			details?: string | string[];
		}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
