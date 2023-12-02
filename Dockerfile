FROM node:18-alpine3.15

# Set working directory
RUN mkdir -p /var/www/kai
WORKDIR /var/www/kai

# Copiar el directorio y su contenido
COPY . ./var/www/kai
COPY package.json tsconfig.json tsconfig.build.json /var/www/kai/

# Instala el Nest CLI globalmente
RUN npm install -g @nestjs/cli

# Instalar las librerías necesarias
RUN npm install --omit=dev

# Buildear la APP
RUN npm run build

# Limpiar el caché
RUN npm cache clean --force

EXPOSE 5000

#start for prod
CMD [ "npm", "run", "start" ]