const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllByCompany
};

async function authenticate({username, password}) {
    const user = await User.findOne({username});
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({sub: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getAllByCompany(company) {
    return await User.find({company: company});
}

async function getById(id) {
    return await User.findById(id);
}

async function create(param) {
    if (await User.findOne({username: param.username})) {
        throw 'Username "' + param.username + '" is already taken';
    }

    const user = new User(param);

    if (param.password) {
        user.hash = bcrypt.hashSync(param.password, 10);
    }

    await user.save();
}

async function update(id, param) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';
    if (user.username !== param.username && await User.findOne({username: param.username})) {
        throw 'Username "' + param.username + '" is already taken';
    }

    if (param.password) {
        param.hash = bcrypt.hashSync(param.password, 10);
    }

    Object.assign(user, param);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
