const db = require('_helpers/db');
const Company = db.Company;
const App = db.App

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    return await Company.find();
}

async function getById(id) {
    return await Company.findById(id);
}

async function create(param) {
    if (await Company.findOne({companyPrefix: param.companyPrefix})) {
        throw 'Company "' + param.companyPrefix + '" is already taken';
    }

    const company = new Company(param);
    await company.save();
}

async function update(id, param) {
    const company = await Company.findById(id);

    if (!company) throw 'Company not found';
    if (company.companyPrefix !== param.companyPrefix && await Company.findOne({companyPrefix: param.companyPrefix})) {
        throw 'Company prefix "' + param.companyPrefix + '" is already taken';
    }

    Object.assign(company, param);

    await company.save();
}

async function _delete(id) {
    await Company.findByIdAndRemove(id);
}
