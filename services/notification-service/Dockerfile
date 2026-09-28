FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/kafka/package.json packages/kafka/package.json
COPY services/notification-service/package.json services/notification-service/package.json
RUN npm ci

COPY tsconfig.base.json ./
COPY packages/kafka packages/kafka
COPY services/notification-service services/notification-service
RUN npm run build --workspace @evt/kafka
RUN npm run build --workspace notification-service

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages/kafka/dist packages/kafka/dist
COPY --from=build /app/packages/kafka/package.json packages/kafka/package.json
COPY --from=build /app/services/notification-service/dist services/notification-service/dist

CMD ["node", "services/notification-service/dist/main.js"]
