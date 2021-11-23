const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    companyName: {type: String, unique: true, required: true},
    companyPrefix: {type: String, unique: true, required: true},
    apps: [{type: Schema.Types.ObjectId, ref: 'App', required: false, unique: false, default: []}],
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    Company: mongoose.model('Company', schema),
};
