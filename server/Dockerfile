FROM node:22 AS base

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./

# Install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/dist/src/ .
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://ai.agin.rocks

EXPOSE 3001

CMD [ "node", "./index.js" ]