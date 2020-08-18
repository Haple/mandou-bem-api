FROM node:12.16.1-alpine
# Install curl
RUN apk add curl
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
# TypeScript
RUN npm run build
# Start
CMD [ "node", "dist/shared/infra/http/server.js"]
EXPOSE 3333
