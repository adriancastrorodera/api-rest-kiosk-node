&nbsp;

# api-rest-kiosk-node proyect

This application is an example of how to develop a Back End Rest API using javascript (Node), with data persistence in MongoDB. Express has been used to deploy a server that listens to requests to handle newspapers and their authors.

MongoDB has been used as a database due to its speed, flexibility and its powerful language when querying the database.


In addition there is an easy way to be able to fill the database with automatic values.


The tests have been carried out in jest, using a preset called @shelf/jest-mongodb to virtualize the database and be able to carry out the unit tests. Only unit tests of the Publisher route have been carried out as an example.

In this project you will be able to appreciate the use of good practices such as the use of the MVC pattern, use of middlewares to manage errors, perform validations or handle responses and use of eslint as code linter.

&nbsp;

## Performance
To deploy the application just follow the steps below.

### Versions used during development
- Npm: 6.14.15
- Node: v14.18.1
- MongoDB: 6.0.1

### Install

To install dependencies:

```
npm install
```

### Execute unit test

To run unit test and linter:

```
npm test
```

### Init server

To deploy the server:

```
npm run start
```

&nbsp;

## Endpoints exposed
The ip and port can be changed in .env file, like connections to mongo.
- Publisher resource enpoints:
    - GET, POST http://127.0.0.1:4000/publisher
    POST endpoint, accepts a body like:
        ```json
            {
		        "id": 10,
		        "name": "Rob Jr.",
	        }
        ```
    - GET http://127.0.0.1:4000/publisher/count (retur the total of publisher stored in the system)
    - GET, PATCH, DELETE http://127.0.0.1:4000/publisher/:id
    PATCH endpoint, accepts a body like:
        ```json
            {
		        "name": "Rob Jr.",
	        }
        ```
    - POST http://127.0.0.1:4000/publisher/load (Load the db with random values)
    Accepts a body like:
        ```json
            {
                "from": 1,
                "to": 100
            }
        ```
- Newspaper resource enpoints:
    - GET, POST http://127.0.0.1:4000/newspaper
    POST endpoint, accepts a body like:
        ```json
            {
	            "id": 2,
	            "title": "Michigan City dispatch.",
	            "image": "public/image/michigan.png",
	            "link": "https://www.britannica.com/place/Michigan",
	            "abstract": "Michigan, constituent state of the United States of America. Although by the size of           its land Michigan ranks only 22nd of the 50 states, the inclusion of the Great Lakes waters over        which it has jurisdiction increases its area considerably, placing it 11th in terms of total        area. The capital is Lansing, in south-central Michigan. The state's name is derived from     michi-gama, an Ojibwa (Chippewa) word meaning 'large lake.'",
	            "publisherId": 10,
	            "languages": ["en", "es", "fr"]
            }
        ```
    - GET http://127.0.0.1:4000/newspaper/count (retur the total of newspaper stored in the system)
    - GET, PATCH, DELETE http://127.0.0.1:4000/newspaper/:id
    PATCH endpoint, accepts a body like:
        ```json
            {
	            "title": "Michigan City dispatch.",
	            "image": "public/image/michigan.png",
	            "link": "https://www.britannica.com/place/Michigan",
	            "abstract": "Michigan, constituent state of the United States of America. Although by the size of           its land Michigan ranks only 22nd of the 50 states, the inclusion of the Great Lakes waters over        which it has jurisdiction increases its area considerably, placing it 11th in terms of total        area. The capital is Lansing, in south-central Michigan. The state's name is derived from     michi-gama, an Ojibwa (Chippewa) word meaning 'large lake.'",
	            "publisherId": 10,
	            "languages": ["en", "es", "fr"]
            }
        ```
    - POST http://127.0.0.1:4000/newspaper/load (Load the db with random values)
    Accepts a body like:
        ```json
            {
                "from": 1,
                "to": 100
            }
        ```

&nbsp;

## API Pagination
The pagination of the api allows the user to perform filters or projections on the endpoint Get all.
Along with the endpoint /count of each resource and the following parameters (sent as a query in the request), it will be possible to perform pagination:
- **limit** (Number): Limit of records to recover.
- **skip** (Number): Number of records to skip in the request response.
- **param** (Value): Setting a parameter of the record and his value, allows to filter by that. Ex: id: 10.
- **field** (String): Setting a string separated by ',' the API allows do a projection of this files. Ex: fields: id,title,publisher.id.
- **hideField** (String): Setting a string separated by ',' the API do a projection hidden the params indicated. Ex: hideFields: publisherId,_id,__v,publisher._id,publisher.__v.

The Get all endpoint, will returns an Object like the following:
```json
    {
        "data": [...], // Records objects
	    "limit": 0, // Limit of fields to recover indicated by the user
	    "skip": 0, // Field skiped indicated by the user
	    "total": 10 // Total of resources returned
    }
```
With this, and the resource explained before, the user can release a pagination in the API.

&nbsp;

## Suggestion to how to deploy this in a production environment
- [Using Docker or manully] Deploy this in a server as a service. You can use Jenkins as CI or do manually.
- [Using Docker, Cloud Formation or manully] Deploy this in AWS as a service using AWS services like EC2. You can use Jenkins as CI or do manually.
- [Using Docker, Cloud Formation or manully] Deploy this in AWS as a AWS Lambda. Also, you can deploy each endpoint as a AWS Lambda and use and AWS Api Gateway to route the request.
- [Using Docker or manully] Use before solutions using Azure.
- Use Third party service to deploy the proyect in a server as a service (like nssm).
