# divelog-server-rest

An Express.js/MongoDB server for a hypothetical website for logging scuba dives.

It is essentially like the existing ScubaEarth.
I had an idea to build a newer version of it because, although I haven't used it for years now (maybe it's improved), I always found ScubaEarth to be buggy/unreliable, and so I thought it would be a fun project to try and make a newer version of it - albeit a rather basic one; this is just a personal project after all.

## Requirements

-   NodeJS
-   NPM
-   MongoDB
-   Redis

## How to run

From the root folder, type `npm i` to install the necessary dependencies.

Add a `.env` file to the `config` folder, with the following constants:

-   `MONGODB_URL`: The URL of your MongoDB database.
-   `JWT_KEY`: The secret key that your JSON Web Tokens will be signed with.
-   `SERVER_PORT`: The port that the server should listen on.
-   `REDIS_HOST`: The host of your Redis server.
-   `REDIS_PORT`: The port that your Redis server is listening on.

Then, you can run the program by typing:
`npm start`

You can also run the unit tests by adding a `.test.env` file to the `config` folder with the same parameters, and then typing:
`npm test`

## Acknowledgements

I got a lot of help from [this](https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122) tutorial. I was already familiar with how to build an Express.js API, but this tutorial was useful in showing how to integrate such an API with MongoDB and how to implement authentication.
