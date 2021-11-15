const mongoose = require('mongoose');
const {SemverType} = require("../../_helpers/semver");
const Schema = mongoose.Schema;

const schema = new Schema({
    appName: {type: String, unique: true, required: true},
    appCode: {type: String, unique: true, required: true},
    rootPath: {type: String, unique: true, required: true},
    createdDate: {type: Date, default: Date.now},
    company: {type: Schema.Types.ObjectId, ref: 'Company'},
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
