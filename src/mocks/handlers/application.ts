import { http, HttpResponse } from 'msw';
import { serverBaseUrl } from '../../config/server-base-url';

export const handlers = [
	http.get(`${serverBaseUrl}/api/applications`, () => {
		return HttpResponse.json('Request intercepted by mock service worker');
	}),
];
