FROM node:22-alpine

# sharp needs vips native lib
RUN apk add --no-cache vips-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --production

COPY src/ src/

# Create uploads directory
RUN mkdir -p uploads/temp

EXPOSE 3001

CMD ["node", "src/index.js"]
