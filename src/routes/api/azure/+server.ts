const { AZURE_AD_GROUP_ID } = process.env;

export async function PUT(event) {
	const token = event.cookies.get('accessToken');

	const groupId = AZURE_AD_GROUP_ID || 'no-group-id-set';
	const response = await fetch(
		`https://graph.microsoft.com/v1.0/groups/${groupId}/members?$select=id,displayName`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const data = await response.json();
	console.log(data.value[3]);
	return new Response(null, { status: 204 });
}
