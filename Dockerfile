FROM node:21.7.1 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

# Instala sentry-cli
# RUN curl -sL https://sentry.io/get-cli/ | bash

# Configura las variables de entorno de Sentry
# ENV SENTRY_AUTH_TOKEN=a5be0a62ab3a66ae015dde1ad9298b22359ff578347222bee8e21a4e138cb77a
# ENV SENTRY_ORG=nxlabsio
# ENV SENTRY_PROJECT=attenpo-pos

# Genera la versión de la release
# RUN VERSION=`sentry-cli releases propose-version` && \
#    sentry-cli releases new "$VERSION" && \
#     sentry-cli releases set-commits "$VERSION" --auto && \
#     sentry-cli releases finalize "$VERSION" && \
#     sentry-cli releases files "$VERSION" upload-sourcemaps ./dist --url-prefix '~/dist' --rewrite

FROM nginx:1.27.0-alpine-slim

COPY --from=build /app/dist/client /usr/share/nginx/html
COPY --from=build /app/.routify /usr/share/nginx/html/.routify

COPY default.conf /etc/nginx/conf.d/

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
