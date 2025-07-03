# BUILD FOR LOCAL DEVELOPMENT
FROM node:22-alpine AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn global add @nestjs/cli

COPY --chown=node:node . .

RUN chown -R node:node /usr/src/app

USER node

CMD ["yarn", "start:dev"]