// import {
//   CLIENT_ID,
//   CLOUD_INSTANCE,
//   TENANT_ID,
//   CLIENT_SECRET,
// } from "$env/static/private";
console.log(process.env)
export const msalConfig = {
	auth: {
		clientId: '999330a6-2e5a-40a1-b4a4-3efbc25b9b7f',
		authority: "https://login.microsoftonline.com/" + "02b6749b-5ce0-4853-bd5c-a05f9bd9dd3a",
		clientSecret: process.env.CLIENT_SECRET,
	},
};
