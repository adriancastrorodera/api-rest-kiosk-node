// Load libraries
const mongoose = require('../../../../libs/mongodb').getMongooseConnection();
const mMongoDB = require('../../../../libs/mongodb');
const { mongodbUtils, utils } = require('../../../utils');
const { NEWSPAPER_LOOKUP, NEWSPAPER_UNWIND } = require('./queries');
const constants = require('../../../constants.js');

// Variables and constants
const collectionName = constants.NEWSPAPER_COLLECTION_NAME;

class Newspaper {

}

const schema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: false },
    abstract: { type: String, required: false },
    publisherId: { type: Number, required: true },
    languages: { type: [String], required: true },
    creation_date: { type: Date, required: true },
});

schema.loadClass(Newspaper);
const Model = mongoose.model('Newspaper', schema, collectionName);
module.exports.Model = Model;

/**
 * Get all newspapers
 * @param {*} query Query with different filters o fields
 * @returns Object with: {data: []}
 */
module.exports.getAll = async (query = {}) => {
    const mongoQuery = {};
    mongodbUtils.generateMongoProjection(mongoQuery, query);
    mongodbUtils.generateMongoFilters(mongoQuery, query);
    mongodbUtils.generateMongoLookup(mongoQuery, NEWSPAPER_LOOKUP);
    mongodbUtils.generateMongoUnwind(mongoQuery, NEWSPAPER_UNWIND);

    return mMongoDB.findAllAndCount(collectionName, mongoQuery);
};

/**
 * Get a newspaper by id
 * @param {*} id Param id
 * @returns Object with: {data: {}}
 */
module.exports.get = async (id) => {
    const query = { id };
    const result = Model.findOne(query);
    return result;
};

/**
 * Get the number newspaper
 * @returns Object with: {data: <Number>}
 */
module.exports.getCount = async () => {
    const result = Model.count();
    return result;
};

/**
 * Save a newspaper in the system
 * @param {*} document Object to save
 * @returns Object with: {data: {}}
 */
module.exports.save = async (document) => {
    const model = new Model(document);
    const result = model.save();
    return result;
};

/**
 * Update a newspaper in the system by id
 * @param {*} id Param id to identify newspaper to update
 * @param {*} document Object to update
 * @returns Object with: {data: {}}
 */
module.exports.update = async (id, document) => {
    const result = Model
        .findOneAndUpdate(
            { id },
            document,
            { new: true },
        );
    return result;
};

/**
 * Delete a newspaper by id
 * @param {*} id Param id
 * @returns Object with: {data: {}}
 */
module.exports.delete = async (id) => {
    const result = await Model.remove({ id });
    return result;
};

/**
 * Load newspapers examples in the system
 * @returns Object with: {data: {}}
 */
module.exports.load = async (from, to) => {
    const newspapers = utils.getNewspaperExamples(from, to);
    const result = Model.insertMany(newspapers);
    return result;
};
