// Load libraries
const mongoose = require('../../../../libs/mongodb').getMongooseConnection();
const mMongoDB = require('../../../../libs/mongodb');
const { mongodbUtils, utils } = require('../../../utils');
const constants = require('../../../constants.js');

// Variables and constants
const collectionName = constants.PUBLISHER_COLLECTION_NAME;

class Publisher {

}

const schema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    joined_date: { type: Date, required: true },
});

schema.loadClass(Publisher);
const Model = mongoose.model('Publisher', schema, collectionName);
module.exports.Model = Model;

/**
 * Get all publishers
 * @param {*} query Query with different filters o fields
 * @returns Object with: {data: []}
 */
module.exports.getAll = async (query = {}) => {
    const mongoQuery = {};

    mongodbUtils.generateMongoProjection(mongoQuery, query);
    mongodbUtils.generateMongoFilters(mongoQuery, query);

    return mMongoDB.findAllAndCount(collectionName, mongoQuery);
};

/**
 * Get a publisher by id
 * @param {*} id Param id
 * @returns Object with: {data: {}}
 */
module.exports.get = async (id) => {
    const query = { id };
    const result = Model.findOne(query);

    return result;
};

/**
 * Get the number publisher
 * @returns Object with: {data: <Number>}
 */
module.exports.getCount = async () => {
    const result = Model.count();
    return result;
};

/**
 * Save a publisher in the system
 * @param {*} document Object to save
 * @returns Object with: {data: {}}
 */
module.exports.save = async (document) => {
    const model = new Model(document);
    const result = model.save();
    return result;
};

/**
 * Update a publisher in the system
 * @param {*} id Param id to identify publisher to update
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
 * Delete a publisher by id
 * @param {*} id Param id
 * @returns Object with: {data: {}}
 */
module.exports.delete = async (id) => {
    const result = Model.remove({ id });
    return result;
};

/**
 * Load publishers examples in the system
 * @returns Object with: {data: {}}
 */
module.exports.load = async (from, to) => {
    const publishers = utils.getPublisherExamples(from, to);
    const result = Model.insertMany(publishers);
    return result;
};
