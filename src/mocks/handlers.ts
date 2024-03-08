import { HttpResponse, http } from 'msw';

export const handlers = [
	http.get('/api', () => {
		return HttpResponse.json('Request intercepted by mock service worker');
	}),
  
	// TODO: Add request handlers as needed
];
