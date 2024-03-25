import { http, HttpResponse } from 'msw';
import { serverBaseUrl } from '../../config/server-base-url';

export const handlers = [
	http.get(`${serverBaseUrl}/api/licenses`, () => {
		return HttpResponse.json('Request intercepted by mock service worker');
	}),
];
