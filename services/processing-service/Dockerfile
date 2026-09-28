FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/kafka/package.json packages/kafka/package.json
COPY services/processing-service/package.json services/processing-service/package.json
RUN npm ci

COPY tsconfig.base.json ./
COPY packages/kafka packages/kafka
COPY services/processing-service services/processing-service
RUN npm run build --workspace @evt/kafka
RUN npm run build --workspace processing-service

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages/kafka/dist packages/kafka/dist
COPY --from=build /app/packages/kafka/package.json packages/kafka/package.json
COPY --from=build /app/services/processing-service/dist services/processing-service/dist

CMD ["node", "services/processing-service/dist/main.js"]
