import { v4 as uuidv4 } from 'uuid';

export const fetchedUsers = [
	{
		id: uuidv4(),
		name: 'Algot',
		updatedAt: new Date().toISOString(),
		licenses: [
			{
				id: uuidv4(),
			},
			{
				id: uuidv4(),
			},
		],
	},
	{
		id: 'test-id',
		name: 'Beatrice',
		updatedAt: new Date().toISOString(),
		licenses: [
			{
				id: uuidv4(),
			},
			{
				id: uuidv4(),
			},
		],
	},
	{
		id: uuidv4(),
		name: 'Cecilia',
		updatedAt: new Date().toISOString(),
		licenses: [],
	},
	{
		id: uuidv4(),
		name: 'Daniel',
		updatedAt: new Date().toISOString(),
		licenses: [
			{
				id: uuidv4(),
			},
		],
	},
	{
		id: uuidv4(),
		name: 'Elisabeth',
		updatedAt: new Date().toISOString(),
		licenses: [
			{
				id: uuidv4(),
			},
			{
				id: uuidv4(),
			},
			{
				id: uuidv4(),
			},
			{
				id: uuidv4(),
			},
		],
	},
];

export const foundUser = {
	user: {
		id: uuidv4(),
		name: 'Cecilia',
		updatedAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	},
	created: false,
};

export const createdUser = {
	user: {
		id: uuidv4(),
		name: 'Namn Namnsson',
		updatedAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	},
	created: true,
};
