# Melosync API

[![Build Status](https://travis-ci.org/melosync/api.svg?branch=master)](https://travis-ci.org/melosync/api)

Melosync web API

## Table of content

<!-- toc -->

- [Quickstart (with Docker)](#quickstart-with-docker)
  * [Prerequisites](#prerequisites)
  * [Up and running](#up-and-running)
  * [Other commands](#other-commands)
    + [Database](#database)
    + [Shell access](#shell-access)
- [Quickstart (without Docker)](#quickstart-without-docker)
- [Environment variables](#environment-variables)
  * [API](#api)
  * [Database](#database-1)
- [Database Migrations](#database-migrations)
  * [Apply the migrations](#apply-the-migrations)
  * [Create a new migration](#create-a-new-migration)

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

## Quickstart (without Docker)

// TODO

## Environment variables

### API

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `PORT` | The port on which the API will listen | `true` | `undefined` |

### Database

You have 2 ways of configuring the database connection.

You can use `DATABASE_URL`:

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `DATABASE_URL` | The database url | `true` | `undefined` |

Or you can specify each field individually:

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `DB_HOST` | The database's hostname | `true` | `undefined` |
| `DB_PORT` | The database's port | `true` | `undefined` |
| `DB_NAME` | The database's name | `true` | `undefined` |
| `DB_USER` | The database's username | `true` | `undefined` |
| `DB_PASSWORD` | The database's password | `true` | `undefined` |

## Database Migrations

> Be sure to have the required environment variables defined before running the commands introduced in this section. See [Database Environment](#database-1).

> You should also make sure that your database is running.

A `typeorm` script is defined in the package.json to help you interact with our ORM.

### Apply the migrations

To apply all pending migrations and update your database schema, run the following:

```sh
npm run typeorm migration:run
```

### Create a new migration

To create a new migration from the model entities, run the following command:

```sh
npm run typeorm migration:generate -n NameOfTheMigration
```

It will create a new migration file in `src/models/migrations`.

> Be sure to apply all pending migrations before creating a new one or the generated migration will be incorrect.
