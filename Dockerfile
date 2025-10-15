# --------- STAGE 1: Build ---------
FROM eclipse-temurin:21-jdk-alpine AS build

# Set working directory
WORKDIR /app

RUN apk add --no-cache postgresql-client bash

# Copy Gradle wrapper and build files first (for caching)
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src ./src

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the project (produces jar in build/libs)
RUN ./gradlew clean bootJar --no-daemon

# --------- STAGE 2: Run ---------
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from previous stage
COPY --from=build /app/build/libs/*.jar app.jar

# Copy the wait-for script (make sure it’s executable)
COPY wait-for-postgres.sh /app/wait-for-postgres.sh
RUN chmod +x /app/wait-for-postgres.sh

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]
