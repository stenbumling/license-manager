import { HttpResponse } from 'msw';

export function triggerMockError() {
	return HttpResponse.json(
		{
			error: 'DeliberateTestError',
			message: 'This is a test error message',
		},
		{ status: 500 },
	);
}
