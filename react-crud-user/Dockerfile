### STAGE 1: Build ###
#FROM node:21.6.1-slim AS build
#WORKDIR /usr/src/app
#COPY package.json ./
#RUN npm install
#COPY . .
#ENV NODE_OPTIONS="--openssl-legacy-provider"
#RUN npm run build

### STAGE 2: Run ###
#FROM nginx:1.17.1-alpine
#COPY default.conf /etc/nginx/conf.d/default.conf
#COPY --from=build /usr/src/app/build /usr/share/nginx/html
#EXPOSE 80
