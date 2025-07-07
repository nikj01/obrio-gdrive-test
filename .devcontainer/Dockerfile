# BUILD FOR LOCAL DEVELOPMENT
FROM node:22-alpine AS dev
RUN apk add --no-cache netcat-openbsd redis
WORKDIR /usr/src/app
COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
RUN yarn prisma generate --schema=src/common/prisma/schema.prisma
RUN chown -R node:node /usr/src/app
USER node
RUN yarn global add @nestjs/cli
CMD ["sleep", "infinity"]

# BUILD FOR PRODUCTION
FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json yarn.lock ./
COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN yarn build
ENV NODE_ENV production
RUN yarn install --frozen-lockfile --production && yarn cache clean
USER node

# PRODUCTION
FROM node:22-alpine AS prod
RUN apk add --no-cache netcat-openbsd redis
WORKDIR /usr/src/app
COPY --chown=node:node package*.json yarn.lock ./
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/src/common/prisma ./src/common/prisma
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
RUN chown -R node:node /usr/src/app
USER node
ENTRYPOINT ["./entrypoint.sh"]