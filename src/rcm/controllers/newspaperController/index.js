const moment = require('moment');
const newspaperModel = require('../../models/newspaperModel');
const publisherModel = require('../../models/publisherModel');
const mErrors = require('../../../modules/errors');

/**
 * Get all newspapers
 * @param {*} req Request of middleware
 * @returns Object with: {data: []}
 */
module.exports.getAll = async (req) => {
    const { query } = req;
    const result = await newspaperModel.getAll(query);

    if (!result || !result[0] || result[0].data.length < 1) {
        return result;
    }
    return result[0];
};

/**
 * Get a newspaper by id
 * @param {*} id Param id
 * @returns Object with: {data: {}}
 */
module.exports.get = async (id) => {
    const result = await newspaperModel.get(id);

    if (!result) {
        throw new mErrors.FuncErrors('resourceNotFound');
    }
    return result;
};

/**
 * Get the number newspaper
 * @returns Object with: {data: <Number>}
 */
module.exports.getCount = async () => {
    const result = await newspaperModel.getCount();
    return result;
};

/**
 * Save a newspaper in the system
 * @param {*} data Object to save
 * @returns Object with: {data: {}}
 */
module.exports.new = async (data) => {
    const document = { ...data };
    document.creation_date = moment().toISOString();

    const publsher = await publisherModel.get(document.publisherId);
    if (!publsher) {
        throw new mErrors.FuncErrors('resourceNotFound', `Can not find a publisher with id: ${document.publisherId} in the system. Please add one first.`);
    }

    let newspaper;
    try {
        newspaper = await newspaperModel.save(document);
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
 * Update a newspaper in the system
 * @param {*} data Object to update
 * @returns Object with: {data: {}}
 */
module.exports.update = async (id, data) => {
    const document = { ...data };

    const publsher = await publisherModel.get(document.publisherId);
    if (!publsher) {
        throw new mErrors.FuncErrors('resourceNotFound', `Can not find a publisher with id: ${document.publisherId} in the system. Please add one first.`);
    }

    const newspaper = await newspaperModel.update(id, document);

    if (!newspaper) {
        throw new mErrors.FuncErrors('resourceNotFound');
    }
    return newspaper;
};

/**
 * Delete a newspaper by id
 * @param {*} id Param id
 * @returns No content
 */
module.exports.delete = async (id) => {
    const oldNewspaper = await newspaperModel.get(id);
    if (!oldNewspaper) {
        throw new mErrors.FuncErrors('resourceNotFound');
    }

    const result = await newspaperModel.delete(id);
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
    const result = await newspaperModel.load(from, to);
    return result;
};
