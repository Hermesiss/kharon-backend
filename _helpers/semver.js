const semver = require('semver');
const mongoose = require('mongoose');
const {CustomError, ErrorType} = require("./error-handler");

class SemverType extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'SemverType');
    }

    cast(val) {
        if (!semver.valid(val)) {
            throw new CustomError('Semver: ' + val + ' is not a valid semver', ErrorType.SemverInvalid, val);
        }

        return semver.clean(val);
    }
}

mongoose.Schema.Types.SemverType = SemverType

module.exports = {SemverType: mongoose.Schema.Types.SemverType}
