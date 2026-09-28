FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/kafka/package.json packages/kafka/package.json
COPY services/order-service/package.json services/order-service/package.json
RUN npm ci

COPY tsconfig.base.json ./
COPY packages/kafka packages/kafka
COPY services/order-service services/order-service
RUN npm run build --workspace @evt/kafka
RUN npm run build --workspace order-service

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages/kafka/dist packages/kafka/dist
COPY --from=build /app/packages/kafka/package.json packages/kafka/package.json
COPY --from=build /app/services/order-service/dist services/order-service/dist

EXPOSE 3000
CMD ["node", "services/order-service/dist/main.js"]
