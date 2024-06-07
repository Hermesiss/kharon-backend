const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** @typedef {object} KharonHosting
 * @property {ObjectId} company - owner company id
 * @property {string} ftpHost - ftp domain or ip e.g. "1.1.1.1"
 * @property {string} ftpPath - path inside ftp e.g. "/www/trismegistus.tech/kharon/apps/"
 * @property{string} rootPath - path for download e.g. "https://trismegistus.tech/kharon/apps"
 */

const schema = new Schema({
    company: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
    ftpHost: {type: String, required: true, default: 'localhost'},
    ftpPath: {type: String, required: true, default: '/path/to/app'},
    rootPath: {type: String, required: true, default: 'https://trismegistus.tech/kharon/apps'}
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    Hosting: mongoose.model('Hosting', schema),
}

