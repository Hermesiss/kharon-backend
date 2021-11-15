require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./entities/users/users.controller'));
app.use('/companies', require('./entities/companies/companies.controller'));
app.use('/apps', require('./entities/apps/apps.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080;
const ip = process.env.NODE_ENV === 'production' ? '0.0.0.0' : process.env.IP;
const server = app.listen(port, ip,function () {
    console.log('Server listening on port ' + port);
});
