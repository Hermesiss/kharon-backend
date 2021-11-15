const db = require('_helpers/db');
const App = db.App;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addVersion, updateVersion, deleteVersion
};

async function addVersion(id, param) {
    const app = await App.findById(id);
    console.log(app.versions)
    console.log(param)
    if (app.versions.some(x => x.version === param.version)) {
        throw 'Version "' + param.version + '" already exists';
    }
    app.versions.push(param)
    app.save()
}

async function updateVersion(id, param) {
    const app = await App.findById(id);
    const index = app.versions.findIndex(x => x.version === param.version);
    if (index >= 0) {
        app.versions[index] = param;
        app.save()
        return;
    }

    throw 'Version "' + param.version + '" not found';
}

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

async function getAll() {
    return await App.find();
}

async function getById(id) {
    return await App.findById(id);
}

async function create(param) {
    if (await App.findOne({username: param.appCode})) {
        throw 'App "' + param.appCode + '" is already taken';
    }

    const app = new App(param);

    await app.save();
}

async function update(id, param) {
    const app = await App.findById(id);

    if (!app) throw 'App not found';
    if (app.appCode !== param.appCode && await App.findOne({appCode: param.appCode})) {
        throw 'App with code "' + param.appCode + '" is already taken';
    }

    Object.assign(app, param);

    await app.save();
}

async function _delete(id) {
    await App.findByIdAndRemove(id);
}
