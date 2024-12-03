FROM node:23.2.0-bullseye-slim

WORKDIR /usr/src/app
COPY . .

RUN yarn install

EXPOSE 8080

CMD yarn run start
