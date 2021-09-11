# Ezy-Editor API

This is an api designed to be used with Ezy-Editor.

## Installation using docker

To install and run the express API connected to an instance of mongodb, first create a mongodb config file in:
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

## Installation without Docker

Firt install dependencies with:

````
npm install
````

### To run with local mongodb instance:

Firt install dependencies with:

````
npm install
````

Then run the express server connected to mongodb with:

````
npm run start-local
````

### To run with connected mongodb account:

Create a config file for mongodb in:

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

Then run the express server connected to mongodb with:

````
npm start
````
