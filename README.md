# Melosync API

[![Build Status](https://travis-ci.org/melosync/api.svg?branch=master)](https://travis-ci.org/melosync/api)

[Docs](https://melosync.github.io/api/)

## Table of content

<!-- The section between the `toc` tags is automatically generated with `npm run readme:update` -->

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
- [Working with translations](#working-with-translations)
  * [Using localized values](#using-localized-values)
  * [Adding new keys](#adding-new-keys)
- [Deployment](#deployment)

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

The server will be started and listen on your local port `5000`. You will be able to access it throught [http://localhost:5000/](http://localhost:5000/).

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
| `PORT` | The port on which the API will listen | `true` | 5000 |
| `JWT_PRIVATE_KEY` | The secret key used by JsonWebTokens | `true` | `undefined` |

### Database

You have 2 ways of configuring the database connection.

You can use `DATABASE_URL`:

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `DATABASE_URL` | The database url | `true` | `undefined` |

## Database Migrations

> Be sure to have the required environment variables defined before running the
> commands introduced in this section. See [Database Environment](#environment-variables).

> You should also make sure that your database is running.

A `typeorm` script is defined in the package.json to help you interact with our ORM.

### Apply the migrations

To apply all pending migrations and update your database schema, run the following:

```sh
npm run typeorm -- migration:run
```

> The `--` here is used to make sure that the next passed parameters or arguments
> are not interpreted by npm and forwarded as is to typeorm's cli. This is
> especialy useful in the next command.

### Create a new migration

To create a new migration from the model entities, run the following command:

```sh
npm run typeorm -- migration:generate -n NameOfTheMigration
```

It will create a new migration file in `sources/models/migrations` named
`$TIMESTAMP-NameOfTheMigration`.

> Be sure to apply all pending migrations before creating a new one or the generated migration will be incorrect.

## Working with translations

We use `i18next` and its koa module `koa-i18next` to handle localization.
See more about i18next [here](https://www.i18next.com/).

Translation files can be found in `sources/assets/locales`. Each folder corresponds to a locale and contains a `translation.json`.

### Using localized values

Controllers will receive locale information in their `Koa.Context` argument.
This context will then contain a function `t` that can be used like this:

```ts
function controller = (ctx: Koa.BaseContext): Promise<void> => {
  ctx.status = 200;
  ctx.body = {
    /* Will return the value associated with the key in the `translation.json` file */
    message: ctx.t("translation.key")
  };
}
```

### Adding new keys

When dealing with translation keys, prevent editing the `translation.json` file yourself. Instead use the script `i18next:extract`.

It will read the whole code base looking for calls to `t(...)` and generate new entries
for the keys that are not listed in the translation file.

```sh
npm run i18next:extract
```

## Deployment

// TODO
