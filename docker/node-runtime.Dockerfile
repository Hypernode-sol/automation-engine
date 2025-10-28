# docker/node-runtime.Dockerfile
FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache python3 py3-pip bash

# Copy node runtime
COPY node_runtime/package.json node_runtime/package-lock.json* ./node_runtime/
RUN cd node_runtime && npm install

COPY node_runtime /app/node_runtime

# Example config/template remains; real config mounted at runtime
ENV HYPERNODE_API=https://api.hypernode.org/v1
ENV HYPERNODE_API_KEY=""

WORKDIR /app/node_runtime
CMD ["node", "connector.js"]
