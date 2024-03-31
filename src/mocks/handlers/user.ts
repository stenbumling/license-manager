import { http, HttpResponse } from 'msw';
import { createdUser, fetchedUsers } from '../data/user';

export const handlers = [
	http.get('/api/users', () => {
		return HttpResponse.json(fetchedUsers);
	}),
	http.post('/api/users', () => {
		return HttpResponse.json(createdUser);
	}),
	http.delete('/api/users/:id', () => {
		return HttpResponse.json({ status: 204 });
	}),
];
