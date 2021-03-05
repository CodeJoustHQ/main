# CodeJoust

CodeJoust is an online real-time competitive coding platform where users can 
compete live against friends to solve programming problems. Players can create
or join a room, choose a problem difficulty and room duration, invite friends,
and begin coding to see who's the best! 

## Running Locally

First, ensure you have the necessary languages and frameworks installed 
(e.g. Java, Maven, Node) and clone this repo. 

Then, export the following environment variable in your local dev environment:

```export JASYPT_ENCRYPTOR_PASSWORD=XXXXXXXXXXXX```

This is for the encrypted password to our database (see `application.properties`).
Please email us at [zpchris@wharton.upenn.edu](zpchris@wharton.upenn.edu) 
with an explanation if you would like access to this for some reason. Otherwise,
replace the `spring.datasource` variables in `application.properties` with your
own database to proceed. 

Run `./mvnw clean install` to build.

Run `./mvnw test` to run tests.

Run `./mvnw spring-boot:run` to start the server.

Once the server is started, the site should be running at 
[localhost:8080](http://localhost:8080), and you can send REST requests to the routes
at `localhost:8080/api/v1/`. 

Note: the server startup process can take some time, so if you are looking to test
some quick frontend changes, you can start `./mvnw spring-boot:run` in one bash window
and run `cd ./frontend && npm start` in another. You can then use 
[localhost:3000](http://localhost:3000) instead, and any changes to frontend files will
immediately be reflected (so you don't need to re-run Maven every time). Be aware that 
occasional socket connection errors can occur when using this method. 

## File Structure

The service is written using Java + Spring Boot on the backend and TypeScript + React on
the frontend. Data is stored in an SQL database. 

The frontend files are mostly located in `frontend/src`:

| `frontend/src/*`           | Description                |
| -------------------------- | -------------------------- |
| `api`                   | Temp                 |
| `components`                  | Temp                       |
| `util`                   | Temp                    |
| `views`                | Temp                        |


The backend files are located under `src/main/java/com/rocketden/main`:


| `src/.../main/*`           | Description                |
| -------------------------- | -------------------------- |
| `config`                   | Temp                 |
| `controller`                  | Temp                       |
| `dao`                   | Temp                    |
| `dto`                | Temp                        |
| `exception`                | Temp                        |
| `game_object`                | Temp                        |
| `model`                | Temp                        |
| `service`                | Temp                        |
| `socket`                | Temp                        |
| `util`                | Temp                        |


Various configuration properties are set in 
`src/main/resources/application.properties`, and unit/integration tests are
located under `src/test/java/com/rocketden/main`. 


