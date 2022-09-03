/* eslint-disable no-use-before-define */
const { ObjectID } = require('mongodb');
const constants = require('../constants.js');

// PUBLIC
/**
 * Get mongo id
 * @param {*} id id to convert if is an invalid mongo id
 * @returns mongo id
 */
function getMongoID(id) {
    if (ObjectID.isValid(id)) {
        return new ObjectID(id);
    }
    return id;
}

/**
 * Allows to prepare projection fields
 * @param {*} fields String of field separated by ,
 * @returns projection
 */
function generateMongoProjectionFields(fields) {
    const projection = {};
    if (fields) {
        // Fields to projection
        fields.split(',').forEach((element) => {
            projection[element] = 1;
        });
    }

    return projection;
}

/**
 * Allows to prepare projection fields to be hiden
 * @param {*} fields String of field separated by ,
 * @returns projection
 */
function generateMongoProjectionFieldsHide(fields) {
    const projection = {};
    if (fields) {
        // Fields to hide
        fields.split(',').forEach((element) => {
            projection[element] = 0;
        });
    }

    return projection;
}

/* eslint-disable no-restricted-syntax,no-param-reassign */
/**
 * Do a mongo query including fleters
 * @param {*} mongoQuery Mongo query
 * @param {*} query Fileters to be aplied
 * @returns mongoQuery
 */
function generateMongoFilters(mongoQuery, query) {
    mongoQuery.filters = {};

    if (query) {
        for (const element in query) {
            if (Object.prototype.hasOwnProperty.call(query, element)) {
                if ((typeof query[element] === 'number' || typeof query[element] === 'string'
                    || typeof query[element] === 'boolean' || query[element]._bsontype === 'ObjectID')
                    && element !== 'fields' && element !== 'hideFields') {
                    const param = convertParam(query[element]);
                    mongoQuery.filters[element] = param;
                    delete query[element];
                } else if (Array.isArray(query[element])) {
                    let key;
                    if (element.startsWith('-')) {
                        // Symbol '-' before query param
                        key = element.substring(1);
                        query[element].forEach((param, i) => {
                            query[element][i] = convertParam(param);
                        });
                        mongoQuery.filters[key] = { $nin: query[element] };
                    } else {
                        // No symbol '-' before query param
                        key = element;
                        query[element].forEach((param, i) => {
                            query[element][i] = convertParam(param);
                        });
                        mongoQuery.filters[key] = { $in: query[element] };
                    }
                    delete query[element];
                }
            }
        }
    }

    return mongoQuery;
}

/**
 * Add a lookup if exist
 * @param {*} mongoQuery Mongo query
 * @param {*} lookup Lookup object
 * @returns mongoQuery
 */
function generateMongoLookup(mongoQuery, lookup) {
    mongoQuery.lookup = lookup;

    return mongoQuery;
}

/**
 * Add a unwind if exist
 * @param {*} mongoQuery Mongo query
 * @param {*} unwind unwind object
 * @returns mongoQuery
 */
function generateMongoUnwind(mongoQuery, unwind) {
    mongoQuery.unwind = unwind;

    return mongoQuery;
}

/**
 * Generate projection of mongo query to get data
 * @param {*} mongoQuery Mongo query
 * @param {*} reqQuery Fileters to be aplied
 * @returns mongoQuery
 */
function generateMongoProjection(mongoQuery, reqQuery) {
    mongoQuery.projection = {};

    if (reqQuery.limit) {
        mongoQuery.projection.limit = parseInt(reqQuery.limit, 10);
        delete reqQuery.limit;
    } else {
        mongoQuery.projection.limit = constants.LIMIT_MONGO_RESULTS;
    }
    if (reqQuery.skip) {
        mongoQuery.projection.skip = parseInt(reqQuery.skip, 10);
        delete reqQuery.skip;
    }
    if (reqQuery.sort) {
        mongoQuery.projection.sort = {};
        if (reqQuery.sort.startsWith('-')) {
            // Descending (when the field name is like '-field')
            mongoQuery.projection.sort[reqQuery.sort.substring(1)] = -1;
        } else {
            // Ascending (when the field name is like 'field')
            mongoQuery.projection.sort[reqQuery.sort] = 1;
        }
        delete reqQuery.sort;
    }

    if (reqQuery.fields) {
        mongoQuery.projection.fields = generateMongoProjectionFields(reqQuery.fields);
    }

    if (reqQuery.hideFields) {
        mongoQuery.projection.hideFields = generateMongoProjectionFieldsHide(reqQuery.hideFields);
    }

    reqQuery.projection = mongoQuery.projection;

    return mongoQuery;
}

// PRIVATE
/**
 * @returns param converted
 */
function convertParam(param) {
    const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

    let result = param;
    if (isInteger(param)) {
        result = parseInt(param, 10);
    } else if (ObjectID.isValid(param) && checkForHexRegExp.test(param)) {
        result = getMongoID(param);
    }

    return result;
}
/**
 * @returns True if is integer
 */
function isInteger(string) {
    const n = Math.floor(Number(string));
    return n !== Infinity && String(n) === string;
}

module.exports.getMongoID = getMongoID;
module.exports.generateMongoProjection = generateMongoProjection;
module.exports.generateMongoFilters = generateMongoFilters;
module.exports.generateMongoProjectionFields = generateMongoProjectionFields;
module.exports.generateMongoLookup = generateMongoLookup;
module.exports.generateMongoUnwind = generateMongoUnwind;
module.exports.generateMongoProjectionFieldsHide = generateMongoProjectionFieldsHide;
