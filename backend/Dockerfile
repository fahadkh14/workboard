FROM node:22-alpine AS dependencies
WORKDIR /app

# Update Alpine security packages 
RUN apk update && apk upgrade
#copy packages
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5431

# Update Alpine security packages 
RUN apk update && apk upgrade

RUN addgroup -S workboard && adduser -S workboard -G workboard

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

RUN chown -R workboard:workboard /app
USER workboard

EXPOSE 5431
CMD ["node", "src/server.js"]
