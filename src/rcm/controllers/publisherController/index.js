const moment = require('moment');
const publisherModel = require('../../models/publisherModel');
const mErrors = require('../../../modules/errors');

/**
 * Get all publishers
 * @param {*} req Request of middleware
 * @returns Object with: {data: []}
 */
module.exports.getAll = async (req) => {
    const { query } = req;
    const result = await publisherModel.getAll(query);

    if (!result || !result[0] || result[0].data.length < 1) {
        return result;
    }
    return result[0];
};

/**
 * Get a publisher by id
 * @param {*} id Param id
 * @returns Object with: {data: {}}
 */
module.exports.get = async (id) => {
    const result = await publisherModel.get(id);

    if (!result) {
        throw new mErrors.FuncErrors('resourceNotFound');
    }
    return result;
};

/**
 * Get the number publisher
 * @returns Object with: {data: <Number>}
 */
module.exports.getCount = async () => {
    const result = await publisherModel.getCount();
    return result;
};

/**
 * Save a publisher in the system
 * @param {*} data Object to save
 * @returns Object with: {data: {}}
 */
module.exports.new = async (data) => {
    const document = { ...data };
    document.joined_date = moment().toISOString();

    let newspaper;
    try {
        newspaper = await publisherModel.save(document);
    } catch (err) {
        if (err.code === 11000) {
            throw new mErrors.FuncErrors('resourceAlreadyExists', err.message);
        } else {
            throw err;
        }
    }

    return newspaper;
};

/**
 * Update a publisher in the system
 * @param {*} data Object to update
 * @returns Object with: {data: {}}
 */
module.exports.update = async (id, data) => {
    const document = { ...data };

    const newspaper = await publisherModel.update(id, document);

    if (!newspaper) {
        throw new mErrors.FuncErrors('resourceNotFound');
    }
    return newspaper;
};

/**
 * Delete a publisher by id
 * @param {*} id Param id
 * @returns No content
 */
module.exports.delete = async (id) => {
    const oldNewspaper = await publisherModel.get(id);
    if (!oldNewspaper) {
        throw new mErrors.FuncErrors('resourceNotFound');
    }

    const result = await publisherModel.delete(id);
    if (!result) {
        throw new mErrors.FuncErrors('resourceNotDelete');
    }

    return result;
};

/**
 * Save publisher examples in the system
 * @param {*} from Init value
 * @param {*} to Final value
 * @returns Object with: {data: {}}
 */
module.exports.load = async (from, to) => {
    const result = await publisherModel.load(from, to);
    return result;
};
