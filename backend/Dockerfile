FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force


FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5431

# Update Alpine security packages
RUN apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

RUN addgroup -S workboard && \
    adduser -S workboard -G workboard

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

RUN rm -rf /usr/local/lib/node_modules/npm && \
    rm -f /usr/local/bin/npm /usr/local/bin/npx && \
    chown -R workboard:workboard /app

USER workboard

EXPOSE 5431

CMD ["node", "src/server.js"]