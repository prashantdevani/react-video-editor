# Build Stage
FROM node:20-alpine as build
# --- START METADATA ---
LABEL org.opencontainers.image.title="React Video Editor"
LABEL org.opencontainers.image.description="A web-based video editor built with React."
LABEL org.opencontainers.image.authors="Prashant Devani"
LABEL org.opencontainers.image.source="https://github.com/prashantdevani/react-video-editor"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.licenses="MIT"
# --- END METADATA ---
WORKDIR /app
COPY package*.json ./

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN apk add --no-cache bash


COPY ./env.sh ./


# If .env is needed in this stage, also copy it explicitly (if present) to the container
# Use this only if you ensure .env exists in the build context
#COPY .env ./



# Make our shell script executable
RUN chmod +x env.sh

COPY --from=build /app/build /usr/share/nginx/html
COPY config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["/bin/bash", "-c", "if [ -d /usr/share/nginx/html ] && [ -f /usr/share/nginx/html/env.sh ]; then /usr/share/nginx/html/env.sh; fi && nginx -g \"daemon off;\""]

