const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const {Roles} = require("./user.model");
const {CustomError, ErrorType} = require("../../_helpers/error-handler");
const {User, Company} = db;


async function authenticate({username, password}) {
    username = processUsername(username);
    const user = await getByName(username);
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

async function getByName(username) {
    username = processUsername(username);
    return await User.findOne({username});
}

function checkUsernameCompany(username, companyPrefix) {
    if (splitUsername(username)[0] !== companyPrefix) {
        throw new CustomError(`User company ${companyPrefix} doesn't correspond to username ${username}`, ErrorType.CompanyUsernameMismatch, {
            companyPrefix,
            username
        }, 422)
    }
}

async function create(param) {
    param.username = checkUsername(param)

    if (await User.findOne({username: param.username})) {
        throw new CustomError('Username "' + param.username + '" is already taken', ErrorType.UserUsernameExists, param.username);
    }

    const company = await Company.findById(param.company)
    if (!company) {
        throw new CustomError(`Cannot find company ${param.company}`, ErrorType.CompanyNotFound, param.company, 422);
    }
    checkUsernameCompany(param.username, company.companyPrefix);

    const user = new User(param);

    if (param.password) {
        user.hash = getPasswordHash(param.password);
    }

    await user.save();
}

function getPasswordHash(password) {
    return bcrypt.hashSync(password, 10);
}

async function update(id, param) {
    const user = await User.findById(id);

    if (!user) throw new CustomError('User not found', ErrorType.UserNotFound, id, 404);
    if (param.username) {
        param.username = checkUsername(param)
    }

    if (user.role === Roles.Admin || user.role === Roles.Owner && param.username !== user.username) {
        throw new CustomError(`Owners and admins cannot change their username`, ErrorType.UserAdminOwnerUsername);
    }

    if (user.username !== param.username && await User.findOne({username: param.username})) {
        throw new CustomError('Username "' + param.username + '" is already taken', ErrorType.UserUsernameExists, param.username);
    }
    const companyService = require('../companies/company.service')
    const company = await companyService.getById(user.company)

    if (param.company && param.company !== user.company.toString()) {
        const newCompany = await companyService.getById(param.company)
        if (!newCompany) {
            throw new CustomError('Company "' + param.companyPrefix + '" is already taken', ErrorType.CompanyPrefixExists, param.companyPrefix);
        }
        param.username = changeUsernameCompany(user.username, newCompany.companyPrefix)
    } else if (param.username && param.username !== user.username) {
        checkUsernameCompany(param.username, company.companyPrefix);
    }

    if (param.password) {
        param.hash = getPasswordHash(param.password);
    }

    Object.assign(user, param);

    await user.save();
};

async function changeCompany(id, companyId) {
    const companyService = require('../companies/company.service')
    const user = await User.findById(id);
    if (user.role === Roles.Admin || user.role === Roles.Owner) {
        throw new CustomError(`Cannot change company for owners and admins`, ErrorType.UserAdminOwnerCompany)
    }
    const newCompany = await companyService.getById(companyId)
    if (user.company !== newCompany) {
        user.company = newCompany
    }

    user.username = changeUsernameCompany(user.username, newCompany.companyPrefix)
    user.save()
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

function processUsername(username) {
    if (!username.includes('@')) {
        username = `${username}@${username}`
    }
    return username;
}

function checkUsername(user) {
    let username = user.username
    if (user.role === Roles.User) {
        const splitted = splitUsername(username)
        if (splitted.length !== 2) {
            throw new CustomError(`Wrong username, must be [company-prefix@username], but received ${username}`, ErrorType.UserUsernameWrongFormat, username)
        }
    }
    return processUsername(username)
}

function splitUsername(username) {
    const splitted = username.split('@')
    if (splitted.length > 2) {
        throw new CustomError(`Wrong username, must be [company-prefix@username], but received ${username}`, ErrorType.UserUsernameWrongFormat, username)
    }
    return splitted
}

function changeUsernameCompany(username, newCompanyPrefix) {
    username = processUsername(username)
    const splitted = splitUsername(username)
    return `${newCompanyPrefix}@${splitted[1]}`
}

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllByCompany,
    getByName,
    changeCompany,
    getPasswordHash
};
