const db = require('_helpers/db');
const {CustomError, ErrorType} = require("../../_helpers/error-handler");
const {App, Hosting} = db;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

/**
 *
 * @return {Promise<Array<KharonHosting>>}
 */
async function getAll() {
    return await Hosting.find();
}

/**
 *
 * @param {String} id
 * @return {Promise<KharonHosting>}
 */
async function getById(id) {
    return await Hosting.findById(id)
}

/**
 *
 * @param {KharonHosting} param
 * @return {Promise<*>}
 */
async function create(param) {
    const hosting = new Hosting(param)
    await hosting.save()
    return hosting
}

/**
 *
 * @param {String} id
 * @param {KharonHosting} param
 * @return {Promise<void>}
 */
async function update(id, param) {
    const hosting = await Hosting.findById(id)
    if (!hosting) {
        throw new CustomError('Hosting not found', ErrorType.NotFound, id, 404)
    }

    Object.assign(hosting, param)
    await hosting.save()
    return hosting
}

/**
 *
 * @param {String} id
 * @return {Promise<void>}
 */
async function _delete(id) {
    return await Hosting.findByIdAndDelete(id)
}
