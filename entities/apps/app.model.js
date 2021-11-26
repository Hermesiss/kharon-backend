const mongoose = require('mongoose');
const {SemverType} = require("../../_helpers/semver");
const Schema = mongoose.Schema;

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
