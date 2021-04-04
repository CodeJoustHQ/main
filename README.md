# CodeJoust

CodeJoust is an online real-time competitive coding platform where users can 
compete live against friends to solve programming problems. Players can create
or join a room, choose a problem difficulty and room duration, invite friends,
and begin coding to see who's the best! 

## Running Locally

First, ensure you have the necessary languages and frameworks installed 
(e.g. Java, Maven, Node) and clone this repo. 

Then, export the following two environment variables in your local dev environment:

1. ```export JASYPT_ENCRYPTOR_PASSWORD=XXXXXXXXXXXX;```
2. ```export PROBLEM_ACCESS_PASSWORD=XXXXXXXXXXXX;```

The first environment variable is for the encrypted password to our database
(see `application.properties`). Please email us at
[zpchris@wharton.upenn.edu](zpchris@wharton.upenn.edu) with an explanation if
you would like access to this for some reason. Otherwise, replace the `spring.datasource`
variables in `application.properties` with your own database to proceed.

The second environment variable is for the encrypted password to correctly set
up the local lock screen on the problem pages. This step is unimportant if you are
not accessing any of the problem pages, but does set up the site as it is currently
running in production.

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
| `api`                      | Functions to initiate calls to the backend REST endpoints |
| `components`               | React components that can be used/reused on various pages |
| `util`                     | Utility functions |
| `views`                    | Different pages of the application |


The backend files are located under `src/main/java/com/rocketden/main`:


| `src/.../main/*`           | Description                |
| -------------------------- | -------------------------- |
| `config`                   | Code used for configuration purposes |
| `controller`               | Classes used to handle incoming REST calls |
| `dao`                      | Interfaces containing methods used to fetch from the database |
| `dto`                      | Objects passed to and from the frontend (plus mapper classes) |
| `exception`                | Exception handlers and error enums |
| `game_object`              | Game-related objects used on the backend |
| `model`                    | Entity classes corresponding to database return objects |
| `service`                  | Service classes that implement most of the app's functionality |
| `socket`                   | Socket events that occur on connect/disconnect |
| `util`                     | Utility functions |


Various configuration properties are set in 
`src/main/resources/application.properties`, and unit/integration tests are
located under `src/test/java/com/rocketden/main`. 


