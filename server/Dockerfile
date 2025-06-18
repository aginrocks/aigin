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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./dist/node_modules

USER nodejs

ENV NODE_ENV=production

EXPOSE 3001

CMD [ "node", "./dist/src/index.js" ]