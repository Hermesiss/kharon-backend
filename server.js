﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const {errorHandler} = require('_helpers/error-handler');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const {join} = require("node:path");
const serveIndex = require("serve-index");
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
    apis: ["server.js",
        "./entities/users/users.controller.js",
        "./entities/apps/apps.controller.js",
        "./entities/companies/companies.controller.js",
        "./entities/hostings/hosting.controller.js"
    ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


require("dotenv").config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

if (process.env.FTP_ENABLED === 'true') {
    const ftp = require('_helpers/ftp');
    ftp.startFtpServer()
    const serveIndex = require('serve-index');
    let ftpDir = '/ftp/';
    app.use('/ftp/tree/:dir', (req, res) => {
        let dir = decodeURIComponent(req.params.dir);
        if (dir === 'root') dir = '';
        const absDir = join(ftpDir, dir);
        res.json(ftp.getFileTree(absDir))
    })
    app.use('/ftp', express.static(ftpDir), serveIndex(ftpDir, {icons: true}));
}

if (process.env.MONGO_HOST_ENABLED === 'true') {
    require('_helpers/mongo-hosting')();
}

// api routes

app.use('/api/ping', (req, res) => {
    res.send('pong');
});

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
app.use('/api/users', require('./entities/users/users.controller'));

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
app.use('/api/companies', require('./entities/companies/companies.controller'));
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
app.use('/api/apps', require('./entities/apps/apps.controller'));

app.use('/api/hostings', require('./entities/hostings/hosting.controller'));

app.use('/api/remote', require('./entities/remote/remote.controller'));

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

app.set('view engine', 'ejs');

app.set('views', './views');

app.use('/', require('./entities/web/web.controller'));


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080;
const ip = process.env.NODE_ENV === 'production' ? '0.0.0.0' : process.env.IP;
const server = app.listen(port, ip, function () {
    console.log(`Server listening on http://${ip}:${port}`);
});
