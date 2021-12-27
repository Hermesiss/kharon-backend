const mongoose = require('mongoose');
const {SemverType} = require("../../_helpers/semver");
const Schema = mongoose.Schema;

/** @typedef {object} KharonVersion
 * @property {string} version
 * @property {string} date
 * @property {string} _id
 * @property {string} changes
 */

/** @typedef {object} KharonApp
 * @property {boolean} published
 * @property {string} ftpHost
 * @property {string} ftpPath
 * @property {string} exePath
 * @property {string} exeParams
 * @property {Array<string>} ignoredFiles
 * @property {Array<string>} ignoredExtensions
 * @property {string} appCode
 * @property {string} appName
 * @property {string} company
 * @property {string} rootPath
 * @property {string} createdDate
 * @property {Array<KharonVersion>} versions
 */

const schema = new Schema({
    published: {type: Boolean, default: false},
    appName: {type: String, unique: true, required: true},
    appCode: {type: String, unique: true, required: true},
    rootPath: {type: String, unique: true, required: true},
    ftpHost: {type: String, required: true, default: 'ftp.myserver.com'},
    ftpPath: {type: String, required: true, default: '/path/to/app'},
    exePath: {type: String, required: true, default: 'app.exe'},
    exeParams: {type: String, default: ''},
    ignoredFiles: [{type: String}],
    ignoredExtensions: [{type: String}],
    createdDate: {type: Date, default: Date.now},
    company: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
    versions: [{
        version: {type: SemverType, default: '1.0.0'},
        date: {type: Date, default: Date.now},
        changes: String
    }]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    App: mongoose.model('App', schema),
};
