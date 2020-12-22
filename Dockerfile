# build environment
FROM node:lts-alpine as build

# make the 'app' folder the current working directory
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /app/

# install project dependencies
RUN npm install --silent

COPY . /app

# build app for production with minification
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build  /app/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
