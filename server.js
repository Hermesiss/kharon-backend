require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const jwt = require('_helpers/jwt');
const { errorHandler } = require('_helpers/error-handler');

const swaggerJsDoc = require('swagger-jsdoc'); 
const swaggerUI = require('swagger-ui-express');
//https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "API",
            description: "API Information",
            servers: ["http://localhost:8080"]
        }
    },
    // ['.routes/*.js']
    apis: ["server.js", "./entities/users/users.controller.js", "./entities/apps/apps.controller.js", "./entities/companies/companies.controller.js" ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
// app.use(jwt());

// api routes

/**
  * @swagger
  * tags:
  *   name: Main
  *   description: Main 
  */
/**
 * @swagger
 * /users:
 *  get:
 *    tags: 
 *      - Main
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use('/users', require('./entities/users/users.controller'));

/**
 * @swagger
 * /companies:
 *  get:
 *    tags: 
 *      - Main
 *    description: Use to request all companies
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use('/companies', require('./entities/companies/companies.controller'));
/**
 * @swagger
 * /apps:
 *  get:
 *    tags: 
 *      - Main
 *    description: Use to request all apps
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use('/apps', require('./entities/apps/apps.controller'));

/**
 * @swagger
 * /api-docs:
 *  get:
 *    tags: 
 *      - Main
 *    description: Api information
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080;
const ip = process.env.NODE_ENV === 'production' ? '0.0.0.0' : process.env.IP;
const server = app.listen(port, ip,function () {
    console.log('Server listening on port ' + port);
});
