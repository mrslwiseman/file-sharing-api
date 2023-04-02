# File-sharing-api

There are plenty of issues with this API, and therefore I would of course not recomend running it in production!

## Stack

- Typescript ( strict as possible )
- Prisma ORM
- Postgres
- Docker / Docker compose

## Issues / room for improvement

- Use of private / public key is not correct in my opinion.
- Error handling is not extensive enough
- Logging can be improved, by use of a standard lib
- Controllers are a bit overloaded with logic

## Running locally

Pre requisites

- node 18 / npm v8+
- docker
- docker-compose

Run `npm start`.
This script will run in the following order:

- initialise .env file from .env.example
- transpile typescript and start API via ts-node

## Testing

Run `npm test`.
This script will run in the following order:

- unit tests
- postgres container
- DB migrations
- integration tests

## Endpoints

- POST /files - as per requirements
- GET /files/:publicKey - as per requirements
- DELETE /files/:privateKey - as per requirements
- POST /files/cleanup - an endpoint that deletes files that have not been accessed within INACTIVE_FILE_THRESHOLD_DAYS. The idea here is to to be triggered by an external CRON.
- Upload / download limits are enforced and daily limit is set by UPLOAD_LIMIT_BYTES and DOWNLOAD_LIMIT_BYTES - this is almost complete but I have not had time to implement fully. The limits are being incremented by IP. I have however set up the database tables and typescript models.
- Some unit tests have been created but not 100% coverage.
- Basic integration tests for the main functionality has been implemented.
- Google Cloud Storage ahs not been configured, but will be fairly straightforward to implement given that I've implemented a storage strategy pattern.

### Notes on use of public/private keys

The use of assymetric encryption here is completely wrong. Sending private keys over the net is not a good idea, especially in the URL!
I have implemented it like that anyway as this is an exececise anyway.

## Postman

There is a postman collection in the `postman` directory for testing endpoints.
