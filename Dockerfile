## Build stage: build the Vite app inside the image
FROM public.ecr.aws/docker/library/node:22-slim AS build

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source and build
COPY . .
RUN npm run build

## Runtime stage: serve built files with nginx
FROM public.ecr.aws/docker/library/nginx:alpine

# Custom nginx config with API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
