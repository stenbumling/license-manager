// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			status: number;
			type: string;
			message: string;
			detail?: string;
		}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
