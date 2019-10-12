FROM node:11-alpine

# Install required dependencies
RUN apk add --no-cache \
        g++ \
        make \
        python

# Create app volume
VOLUME /app
WORKDIR /app

CMD npm install \
    && npm run dev
