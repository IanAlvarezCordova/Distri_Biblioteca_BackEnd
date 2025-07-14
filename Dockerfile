FROM node:18

WORKDIR /usr/src/app

# Copiar solo los archivos de configuración primero
COPY package*.json ./

# Instalar dependencias (esto compilará bcrypt dentro del contenedor)
RUN npm install

# Copiar el resto del código después de instalar dependencias
COPY . .

# Construir la aplicación
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]