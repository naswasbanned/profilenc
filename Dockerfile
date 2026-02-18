FROM nginx:alpine

# Copy built files into nginx web root
COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
