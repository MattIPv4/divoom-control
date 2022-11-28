FROM node:16-bullseye

RUN apt-get upgrade && \
    apt-get update && \
    apt-get install --no-install-recommends -y build-essential libbluetooth-dev && \
    mkdir /app

WORKDIR /app

ADD src /app/src
ADD package-lock.json /app
ADD package.json /app

RUN npm ci

ENTRYPOINT [ "node","src/cli.js" ]
