# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json

RUN apk add git

RUN npm install
RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app
RUN npm run build

EXPOSE 80

#CMD [ "npm","start"]

# production environment
FROM nginx:1.16.0-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

