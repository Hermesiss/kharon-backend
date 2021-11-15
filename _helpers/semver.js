const semver = require('semver');
const mongoose = require('mongoose');

class SemverType extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'SemverType');
    }

    cast(val) {
        if (!semver.valid(val)) {
            throw new Error('Semver: ' + val + ' is not a valid semver');
        }

        return semver.clean(val);
    }
}

mongoose.Schema.Types.SemverType = SemverType

module.exports = {SemverType: mongoose.Schema.Types.SemverType}
