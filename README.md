# divelog-server
An Express.js/MongoDB server for a hypothetical website for logging scuba dives.

It is essentially like the existing ScubaEarth.
I had an idea to build a newer version of it because, although I haven't used it for years now (maybe it's improved), I always found ScubaEarth to be buggy/unreliable, and so I thought it would be a fun project to try and make a newer version of it - albeit a rather basic one; this is just a personal project after all.
My plan is to eventually build the frontend as well.

## Work in progress

Not all routes have been completed yet, although most have.

I also need to update the included unit tests - currently they have been imported straight over from an older version of this project where I was using a MySQL database. Since restarting with Mongoose, I've made changes to how outputs are handled, so changes to unit tests need to be made which I haven't done yet (so far, I have been testing by making requests via Postman).

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
(But, as noted above, they currently need to be updated.)

## Acknowledgements

I got a lot of help from [this](https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122) tutorial about how to generate and store JSON Web Tokens, as well as how to create router functions that call a Mongoose database and successfully handle the output from that. It really helped me get going with this project, so thank you.
