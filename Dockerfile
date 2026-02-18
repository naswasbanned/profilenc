## Build stage: build the Vite app inside the image
FROM node:22-alpine AS build

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source and build
COPY . .
RUN npm run build

## Runtime stage: serve built files with nginx
FROM nginx:alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
