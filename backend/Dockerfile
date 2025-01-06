FROM node:23.2.0-bullseye-slim

USER root
RUN useradd -ms /bin/bash ar3m

USER ar3m
WORKDIR /usr/src/app
COPY --chown=ar3m:ar3m . .

RUN npm install

EXPOSE 8080

CMD npm run start
