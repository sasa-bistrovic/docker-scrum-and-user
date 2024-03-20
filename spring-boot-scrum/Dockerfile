FROM maven:3.9.6-sapmachine-21 AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
COPY react-crud-scrum-build /workspace/react-crud-scrum-build
RUN mvn -f pom.xml clean package

FROM openjdk:21-jdk
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
