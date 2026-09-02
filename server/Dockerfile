FROM public.ecr.aws/docker/library/node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --production

COPY src/ src/

# Create uploads directory
RUN mkdir -p uploads/temp

EXPOSE 3001

CMD ["node", "src/index.js"]
