const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRoles = {
    None: "none",
    User: "user",
    Owner: "owner",
    Admin: "admin"
}

const schema = new Schema({
    username: {type: String, unique: true, required: true},
    hash: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdDate: {type: Date, default: Date.now},
    role: {type: UserRoles, default: UserRoles.User},
    company: {type: Schema.Types.ObjectId, ref: 'Company'}
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = {
    User: mongoose.model('User', schema),
    Roles: UserRoles
};
