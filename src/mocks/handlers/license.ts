import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/api/licenses', () => {
		return HttpResponse.json('Request intercepted by mock service worker');
	}),
];
