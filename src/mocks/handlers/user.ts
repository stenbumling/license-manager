import { http, HttpResponse } from 'msw';
import { serverBaseUrl } from '../../config/server-base-url';
import { createdUser, fetchedUsers } from '../data/user';

export const handlers = [
	http.get(`${serverBaseUrl}/api/users`, () => {
		return HttpResponse.json(fetchedUsers);
	}),
	http.post(`${serverBaseUrl}/api/users`, () => {
		return HttpResponse.json(createdUser);
	}),
	http.delete(`${serverBaseUrl}/api/users/:id`, () => {
		return HttpResponse.json({ status: 204 });
	}),
];
