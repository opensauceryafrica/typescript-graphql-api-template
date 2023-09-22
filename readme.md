# Typescript GraphQL API Template

GraphQL for the everyday human.

## Running

To setup this service for local or remote deployment on a computer environment, below are the steps you need to follow.

Clone the repository

```shell
git clone https://github.com/opensauceryafrica/typescript-graphql-api-template.git .

```

Move into the directory and install the necessary dependencies

```shell
cd typescript-graphql-api-template
yarn install
```

> Note that the assumption is that you already have a recent version of node (16+) install on your computer

Now that you've installed the dependencies...you can build the code and run

```shell
yarn build:start
```

If you would like to keep your code running in an iteration mode such that your changes reflect as you save, then use the follow command instead to run in development mode

```shell
yarn dev
```

## Deployment

### Render Cloud

To deploy this service on Render, you need to create a Render web service and select a Docker environment as your deployment environment as well as set the required env variables so they can become available to the Docker context. Check the `.env.example` file for the list of required env variables. Connect the right GitHub repository to the Render service and set the branch to `main` and the path to `./` and then proceed to deploy.

In addition, a GitHub workflows has been setup with the name `render.dev.yaml` and `render.prod.yaml` to automatically deploy all following changes created either by a push or pull request.
