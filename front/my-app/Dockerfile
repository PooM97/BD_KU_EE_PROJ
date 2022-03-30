FROM node:16.14.0 as build
WORKDIR /my-app

COPY package*.json /
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /my-app/build /usr/share/nginx/html