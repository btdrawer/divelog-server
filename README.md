# divelog-server
An Express.js/MongoDB server for a hypothetical website for logging scuba dives.

It is essentially like the existing ScubaEarth.
I had an idea to build a newer version of it because, although I haven't used it for years now (maybe it's improved), I always found ScubaEarth to be buggy/unreliable, and so I thought it would be a fun project to try and make a newer version of it - albeit a rather basic one; this is just a personal project after all.
My plan is to eventually build the frontend as well.

## Requirements

- NodeJS
- NPM
- Mongoose

## How to run

From the root folder, type `npm i` to install the necessary dependencies.

Add a `.env` file to the root folder, with the following variables:
- `MONGODB_URL`: The URL of your Mongoose database.
- `JWT_KEY`: The secret key that your JSON Web Tokens will be signed with.
- `PORT`: The port that the server should listen on.

Then, you can run the program by typing:
```npm start```

You can also run the unit tests by typing:
```npm test```

## Acknowledgements

I got a lot of help from [this](https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122) tutorial. I was already familiar with how to build an Express.js API, but this tutorial was useful in showing how to integrate such an API with MongoDB and how to implement authentication.
