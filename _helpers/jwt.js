const expressJwt = require('express-jwt');
const userService = require('../entities/users/user.service');

module.exports = jwt;

require("dotenv").config();

function jwt() {
    const secret = process.env.JWT_SECRET;
    return expressJwt({secret, algorithms: ['HS256'], isRevoked}).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            {url: /^\/api-docs.*/, methods: ['GET']},
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
