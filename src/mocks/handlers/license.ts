import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/license', () => {
		return HttpResponse.json('Request intercepted by mock service worker');
	}),

	// TODO: Add request handlers as needed
];
