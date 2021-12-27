const db = require('_helpers/db');
const {semver} = require("semver");
const {App, Company} = db;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addVersion, updateVersion, deleteVersion
};

/**
 *
 * @param {String} a
 * @param {String} b
 * @return {number|*}
 */
const compareVersions = (a,b) => semver.rcompare(a.version, b.version)

/**
 *
 * @param {String} id
 * @param {KharonVersion} param
 * @return {Promise<void>}
 */
async function addVersion(id, param) {
    const app = await App.findById(id);
    console.log(app.versions)
    console.log(param)
    if (app.versions.some(x => x.version === param.version)) {
        throw 'Version "' + param.version + '" already exists';
    }
    app.versions.push(param)
    app.versions = app.versions.sort(compareVersions)
    app.save()
}

/**
 *
 * @param {String} id
 * @param {KharonVersion} param
 * @return {Promise<void>}
 */
async function updateVersion(id, param) {
    const app = await App.findById(id);
    const index = app.versions.findIndex(x => x.version === param.version);
    if (index >= 0) {
        app.versions[index] = param;
        app.versions = app.versions.sort(compareVersions)
        app.save()
        return;
    }

    throw 'Version "' + param.version + '" not found';
}

/**
 *
 * @param {String} id
 * @param {KharonVersion} param
 * @return {Promise<void>}
 */
async function deleteVersion(id, param) {
    const app = await App.findById(id);
    const index = app.versions.findIndex(x => x.version === param.version);
    if (index >= 0) {
        app.versions.splice(index, 1);
        app.save()
        return;
    }

    throw 'Version "' + param.version + '" not found';
}

/**
 *
 * @return {Promise<Array<KharonApp>>}
 */
async function getAll() {
    return await App.find();
}

async function getById(id) {
    return await App.findById(id);
}

/**
 *
 * @param {KharonApp} param
 * @return {Promise<void>}
 */
async function create(param) {
    if (await App.findOne({appCode: param.appCode})) {
        throw 'App "' + param.appCode + '" is already taken';
    }

    const company = await Company.findById(param.company)

    const app = new App(param);

    await app.save();

    company.apps.push(app)

    await company.save()
}

/**
 *
 * @param {KharonCompany} company
 * @param id
 * @return {Promise<void>}
 */
async function deleteAppFromCompany(company, id) {
    const index = company.apps.findIndex(x => x.toString() === id);

    if (index >= 0) {
        company.apps.splice(index, 1);
        await company.save()
    }
}

async function update(id, param) {
    const app = await App.findById(id);

    if (!app) throw 'App not found';

    if (app.appCode !== param.appCode && await App.findOne({appCode: param.appCode})) {
        throw 'App with code "' + param.appCode + '" is already taken';
    }

    if (param.company && app.company.toString() !== param.company) {
        const oldCompany = await Company.findById(app.company)
        console.log(oldCompany)
        if (oldCompany) {
            await deleteAppFromCompany(oldCompany, app.id);
        }

        const newCompany = await Company.findById(param.company)

        if (!newCompany) {
            throw `Cannot find company ${param.company}`;
        }

        if (newCompany.apps.indexOf(app.id) === -1) {
            newCompany.apps.push(app.id);
        }

        await newCompany.save()

        console.log(`Changing company ${oldCompany} to ${newCompany}`)
    } else {
        console.log(`No need to change company, ${param.company} equals ${app.company.toString()}`)
    }

    Object.assign(app, param);

    await app.save();
}

async function _delete(id) {
    const companies = await Company.find({"apps": {$elemMatch: {$eq: id}}})
    for (const company of companies) {
        await deleteAppFromCompany(company, id)
    }

    await App.findByIdAndRemove(id);
}
