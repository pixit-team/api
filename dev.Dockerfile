FROM node:11-alpine

VOLUME /app
WORKDIR /app

CMD npm install \
    && npm run typeorm -- migration:run \
    && npm run dev
