FROM node:11-alpine

# Install gettext, which is needed for handling for environment variables
RUN apk add --no-cache gettext

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN rm -rf node_modules && npm install && npm cache clean --force \
 && mv ./tools/ENV_VARS.js ./tools/ENV_VARS.temp.js

EXPOSE 4567
CMD ["/bin/sh", "-c", "envsubst < ./tools/ENV_VARS.temp.js > ./tools/ENV_VARS.js && npm start"]
