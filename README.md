# CalorieApp

A web application that allows users to keep track of their meals, including a description and the calorie amount for each meal. This is built by Angular 2 and Node.js.

Backend:

* Node.js
* Express.js
* MongoDB
* Passport-JWT

Frontend:

* Angular 2 (Angular CLI)

## Prerequisites

You will need the following resources properly installed on your computer.

* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org) (with NPM)
* [MongoDB](https://www.mongodb.com)

## Getting Started

```bash
# Install the dependencies
$ npm install
```

### Run the backend API

```bash
$ npm run server
```

By default, you can visit the API in your web browser at `http://localhost:8000`

You can run the server with seed data. (The database will be initialized with test data.)

```bash
$ npm run server:seed
```

The API tests live in the `/test` directory. The test cases are written using Mocha and Chai.

```bash
$ npm run test:server
```

### Run the frontend

```bash
$ npm start
```

Now you can access the frontend by visiting [http://localhost:4200](http://localhost:4200)

