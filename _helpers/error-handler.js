function errorHandler(err, req, res, next) {
    console.log(err)
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({message: err, type: ErrorType.Custom});
    }

    if (err.type || err.status) {
        const type = err.type ?? ErrorType.Custom
        const status = err.status && Number.isInteger(err.status) ? err.status : 400
        return res.status(status).json({message: err, type});
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({message: err.message, type: ErrorType.MongooseValidation});
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: 'Invalid Token', type: ErrorType.AuthInvalidToken});
    }

    // default to 500 server error
    return res.status(500).json({message: err.message});
}

/**
 *
 * @enum {string}
 */
const ErrorType = {
    AuthInvalidToken: 'auth_invalid_token',
    MongooseValidation: 'mongoose_validation',
    Custom: 'custom',
    WrongCredentials: 'auth_wrong_credentials',
    SemverInvalid: 'semver_invalid',
    VersionExists: 'version_exists',
    VersionNotFound: 'version_not_found',
    AppCodeExists: 'app_code_exists',
    AppNotFound: 'app_not_found',
    CompanyNotFound: 'company_not_found',
    CompanyPrefixExists: 'company_prefix_exists',
    CompanyUsernameMismatch: 'company_username_mismatch',
    UserUsernameExists: 'user_username_exists',
    UserNotFound: 'user_not_found',
    UserAdminOwnerUsername: 'user_admin_owned_username',
    UserAdminOwnerCompany: 'user_admin_owned_company',
    UserUsernameWrongFormat: 'user_username_wrong_format'
}

class CustomError extends Error {
    /**
     *
     * @param message
     * @param {ErrorType} type
     * @param {any} [params]
     * @param {Number} [status]
     */
    constructor(message, type, params = null, status = 400) {
        super(message);
        this.name = "CustomError"
        this.type = type
        this.status = status
        this.params = params
    }
}

module.exports = {errorHandler, ErrorType, CustomError};
