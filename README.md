# Melosync API

Melosync web API

## Table of content

<!-- toc -->
<!-- tocstop -->

## Quickstart (with Docker)

We recommend using docker and docker-compose to make the setup easier.

### Prerequisites

- `docker` and `docker-compose`: see [https://docs.docker.com/install/overview/](https://docs.docker.com/install/overview/)

> The API needs to be linked to a Postgres database in order to operate correctly. One will be automatically created for you from our `docker-compose` configuration.

### Up and running

To start the local development server, run the following:

```sh
docker-compose up api
```

The server will be started and listen on your local port `3000`. You will be able to access it throught [http://localhost:3000/](http://localhost:3000/).

To stop all running containers, run:

```sh
docker-compose down
```

### Other commands

#### Database

You can start the database independently with the following command:

```sh
docker-compose up db

# You can also start it in the background with the `-d` option
docker-compose up -d db
```

If you want to clear all existing data, you can remove the local volumes:

```sh
docker-compose down -v
```

And then run `docker-compose up api` again.

#### Shell access

To start a shell inside the container, run the following:

```sh
docker-compose run --rm api sh
```

You can then run commands like `npm install ...` from the container.

> The `--rm` option is used to remove the container after its execution and not have mulitple existing instances
