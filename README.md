## Ezy-Editor API

This is an api designed to be used with Ezy-Editor.

### Installation using docker

To install and run the express API connected to a local instance of express, first create a mongodb config file in:
````
db/config.json
````
This file shold be formatted as follows:
````
{
    "username": "<mongodb-username",
    "password": "<mongodb-passwor>"
}
````

To install and run docker containers for mongodb connected to the express API use the following commands.

````
docker-compose up mongodb
````
````
docker-compose up express
````

### Installation without Docker



