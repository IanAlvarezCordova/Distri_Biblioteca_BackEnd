# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias primero para aprovechar la caché
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm install --production

# Copia el resto de tu aplicación al contenedor
COPY . .

# Compila el proyecto NestJS (usa tsconfig)
RUN npm run build

# Expone el puerto que usará la app (Render detecta esto automáticamente)
EXPOSE 3000

# Comando que ejecuta la app en modo producción
CMD ["npm", "run", "start:prod"]
