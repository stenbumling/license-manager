# Nexer Örebro license manager (for internal use)

This is a simple CRUD application for managing licenses – in particular for the Örebro office of Nexer Group. Its purpose is to keep track of all our licenses so that they can make better decisions on how to allocate them.

## Tech stack

### Svelte & SvelteKit

The application is built with [Svelte](https://svelte.dev/) and [SvelteKit](https://kit.svelte.dev/), and it comes with two parts: 1) a client and 2) a Node.js server. The server is mainly responsible for providing a REST API (defined in [api route](src/routes/api) folder) for the client to interact with, but also handles authentication, authorization, and more. The application also utilizes TypeScript.

*To learn more about the Svelte framework, check out [ Sveltes documentation page ](https://svelte.dev/docs/introduction) as well as [SvelteKits documentation page](https://kit.svelte.dev/docs/introduction).*

### Sequelize & MSSQL

The server uses [Sequelize v6](https://sequelize.org/) to interact with the database that stores the licenses and its associated data. Sequelize provides an easy way to define models and associations between them, and to perform CRUD operations on the database. The structure of the data and the associations between them is defined in the [models](src/lib/server/models/) folder. The application is currently set up to be used with a **MSSQL** database, but Sequelize supports other databases as well, like PostgreSQL and MySQL.

*For more information about Sequelize and database configuration, see the [official documentation](https://sequelize.org/docs/v6/) and the [API reference](https://sequelize.org/api/v6/identifiers.html).*

## Prerequisites for local development

### Required

- Before you begin, ensure you have **Node.js (v18.13 or later)** and **npm** installed. You can download Node.js from [nodejs.org](https://nodejs.org/).

- You will also need access to a MSSQL database to store the application data in. For configuration of the database, follow the [installation instructions](#installation-and-setup).

### Recommended

While not strictly necessary, if you're using Visual Studio Code, it is recommended to install the official [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension. This will provide you with syntax highlighting, code completion, and other useful features for working with Svelte.

## Installation and setup

1. Clone the repository (You might have to generate Git credentials in Azure DevOps first)

```
git clone https://sigmaorebro@dev.azure.com/sigmaorebro/LIA-%20intern%20licens%20hantering/_git/license-manager-nexer-orebro
cd license-manager-nexer-orebro
```

2. Install dependencies

```
npm install
```

3. Create a `.env.local` file in the root of the project according to the `.env.example` file

> Note that this app is dependent on **Azure AD/Entra** for authentication. If you wish to bypass the authentication during development, set SKIP_AUTH to true in the `.env.local` file.
>
> Also note that the server is built for use with a MSSQL database. If you want to use a different type of database, you can change database settings in the [database config file](src/lib/server/db.ts?), but you may also have to update some code elsewhere and install the necessary packages for the chosen database.

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