const mongoose = require('mongoose');

require("dotenv").config();

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../entities/users/user.model').User,
    App: require('../entities/apps/app.model').App,
    Company: require('../entities/companies/company.model').Company
};


