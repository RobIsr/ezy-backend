[![Build Status](https://app.travis-ci.com/RobIsr/ezy-backend.svg?branch=main)](https://app.travis-ci.com/RobIsr/ezy-backend)

# Ezy-Editor API

This is an api designed to be used with Ezy-Editor.

Mongo DB community server can be downloaded from [Mongo DB website](https://www.mongodb.com/try/download/community) for different operating systems.

On mac it can easily be installed with:

````
brew tap mongodb/brew
brew install mongodb-community@5.0
````

This is a prerequisite for running local instances of mongodb.

----

## Installation using docker

### To run with local mongodb instance:

To start the express server connected to a local instance of mongodb use:

````
docker-compose up express
````

### To run with connected mongodb Atlas account:

Create a new file ``` .env.production.local ``` in the root directory with the following structure:

````
DATABASE_DSN=<YOUR CONNECTION STRING FROM ATLAS>
````

Where "YOUR CONNECTION STRING FROM ATLAS" is the authentication string generated in your Atlas account containing your username and password.

You can now run the express server connected to mongodb Atlas with:

````
docker-compose up express-production
````

----

## Installation without Docker

Firt install dependencies with:

````
npm install
````

### To run with local mongodb instance:

Run the express server connected to local mongodb instance with:

````
npm start
````

### To run with connected mongodb Atlas account:

Create a new file ``` .env.production.local ``` in the root directory with the following structure:

````
DATABASE_DSN=<YOUR CONNECTION STRING FROM ATLAS>
````

Where "YOUR CONNECTION STRING FROM ATLAS" is the authentication string generated in your Atlas account containing your username and password.

You can now run the express server connected to mongodb Atlas with:

````
npm run start-production
````

----

## API Routes

````
GET /allDocs
````
This route returns all documents in the collection.

Example result:

````
{
    "data": [
        {
            "_id": "613c3f56464ef24cda66fbe1",
            "type": "documents",
            "name": "Test document",
            "html": "<h3>Testing document editor.</h3>\n<p>This is a test document.</p>"
        },
        {
            "_id": "613c6c159d4ecf0a80f3f54c",
            "type": "documents",
            "name": "Another test",
            "html": "<p>Another test!</p>"
        }
    ]
}
````

----

````
POST /save
````

Saves a document to the collection.

Required parameters:
````
name
html
````

Result:
````
HTTP Status Code 201 Created
````

----

````
PUT /update
````

Updates a document in the collection.

Required parameters:
````
id
name
html
````

Result:
````
HTTP Status Code 200 Ok
````
