# Etapa 1: Build do Frontend (React + Vite)
FROM node:24-alpine AS build-frontend
WORKDIR /app/frontend

# Copiar os arquivos de dependência primeiro para aproveitar cache do Docker
COPY package.json package-lock.json* ./

# Instala dependências (usa npm ci se package-lock existir)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia o restante do código do frontend e compila
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js eslint.config.js ./
RUN npm run build

# Etapa 2: Build do Backend (Spring Boot + Maven)
FROM maven:3.9-eclipse-temurin-17 AS build-backend
WORKDIR /app/backend

# Copia o POM para aproveitar cache do Maven
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código do backend
COPY backend/src ./src

# Copia o build do frontend para a pasta de recursos estáticos do backend
COPY --from=build-frontend /app/frontend/dist /app/backend/src/main/resources/static

# Compila o JAR do Spring Boot
RUN mvn clean package -DskipTests

# Etapa 3: Imagem Final (Execução)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia apenas o JAR final
COPY --from=build-backend /app/backend/target/*.jar app.jar

# Configura as variáveis de ambiente necessárias
ENV PORT=${PORT:-8080}
ENV PRODUCTION=true

# Expõe a porta que o Spring Boot usará
EXPOSE $PORT

# Executa o JAR
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
