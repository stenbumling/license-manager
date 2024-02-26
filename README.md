# Client for Nexer Örebro license manager

This is a simple CRUD application for managing licenses – in particular for the Örebro office of Nexer. Its purpose is to keep track of all their licenses so that they can make better decisions on how to allocate them.

The application is built using Svelte and SvelteKit. To learn more about the Svelte framework, check out [ Sveltes documentation page ](https://svelte.dev/docs/introduction) as well as [SvelteKits documentation page](https://kit.svelte.dev/docs/introduction).

## Prerequisites for local development

Before you begin, ensure you have **Node.js (v18.13 or later)** and **npm** installed. You can download Node.js from [nodejs.org](https://nodejs.org/).

The license manager is intended to work together with [license manager server](https://dev.azure.com/sigmaorebro/LIA-%20intern%20licens%20hantering/_git/Licenshantering-backend). If you're not connecting directly to the server running in production on Azure, you will also need to set up the server locally. Check out the server's [README](https://dev.azure.com/sigmaorebro/LIA-%20intern%20licens%20hantering/_git/Licenshantering-backend) for more information.

While not strictly necessary, if you're using Visual Studio Code, it is recommended to install the official [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension. This will provide you with syntax highlighting, code completion, and other useful features for working with Svelte.

## Installation and setup

1. Clone the repository (You might have to generate Git credentials in Azure DevOps)

```
git clone https://sigmaorebro@dev.azure.com/sigmaorebro/LIA-%20intern%20licens%20hantering/_git/Licenshantering-frontend
cd Licenshantering-frontend
```

2. Install dependencies

```
npm install
```

3. Create a `.env.local` file in the root of the project according to the `.env.local.example` file

> Note that this app is dependent on **Azure AD/Entra** for authentication. If you wish to bypass the authentication during development, set SKIP_AUTH to true in the `.env.local` file.

4. Start the development server

```
npm run dev
```

## Building and running in production mode

To build and run the application in production mode, run the following commands:

```
npm run build
npm run preview
```

This project is using the `adapter-node` adapter for building the application as a Node.js server. The chosen adapter doesn't matter for local development, but it is necessary for deploying it as an Azure App Service. If you want to use a different adapter, you can change it in the [svelte.config.js](svelte.config.js) file. Check the [documentation for different kind of adapters](https://kit.svelte.dev/docs/adapters) for more information.
