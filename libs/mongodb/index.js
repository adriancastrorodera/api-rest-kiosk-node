/* eslint-disable no-use-before-define */

/** ****************************************
    Module: MongoDB
    Description: Connection to MongoDB, reconnection, error handling...
******************************************* */
const mongoose = require('mongoose');
const config = require('../../src/modules/config').getConfig();
const constants = require('../../src/constants');

/**
 * Init mongoose connection
 * @returns null
 */
function getDBConnection() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.db;
    }

    mongoose.connection.close();
    initConnection();

    return null;
}

/**
 * Return the connection to mongo
 * @returns @see mongoose.connection
 */
function initConnection() {
    const uri = `mongodb://${config.interface_to_connect.mongodb.host}:${config.interface_to_connect.mongodb.port}/${config.interface_to_connect.mongodb.database}`;

    const options = {
        user: config.interface_to_connect.mongodb.username,
        pass: config.interface_to_connect.mongodb.password,
        autoReconnect: true,
        keepAlive: true,
    };

    (function mongooseConnection() {
        mongoose.connect(uri, options).catch((e) => {
            if (e.name === 'MongoNetworkError') {
                mongoose.connection.close();
                setTimeout(mongooseConnection, constants.MONGODB_RECONNECTION_TIME);
            }
        });
    }());

    mongoose.connection.on('connected', () => {
        console.info(`MongoDB connection established ${uri}`);
    });
    mongoose.connection.on('reconnected', () => { console.info('MongoDB reconnected established'); });
    mongoose.connection.on('error', (error) => { console.info(`MongoDB error ${error}`); });
    mongoose.connection.on('disconnected', () => { console.info('MongoDB disconnected'); });
    mongoose.connection.on('close', () => { console.info('MongoDB close'); });
    mongoose.connection.on('fullsetup', () => { console.info('MongoDB fullsetup'); });
    mongoose.connection.on('all', () => { console.info('MongoDB connecting to a replica set'); });
    mongoose.connection.on('reconnectFailed', () => { console.info('MongoDB reconnectFailed'); });
    mongoose.connection.on('reconnectTries', () => { console.info('MongoDB reconnectTries'); });

    return mongoose.connection;
}

/**
 * Return mongoose instance already connected.
 * @returns @see mongoose
 */
function getMongooseConnection() {
    return mongoose;
}

/**
 * Allows to return field from mongo in a pipeline
 * aggregating filters
 * @param {*} collectionName Collection name to recover data
 * @param {*} query query to be executed
 * @returns Array<Object>
 */
async function findAllAndCount(collectionName, query) {
    if (!getDBConnection()) {
        return 'MongoDB Connection lost';
    }
    const collection = getDBConnection().collection(collectionName);

    const pipelines = [];

    // Pipeline filters
    pipelines.push({ $match: query.filters });

    // Pipeline sort
    if (query.projection && query.projection.sort) {
        pipelines.push({ $sort: query.projection.sort });
    }

    // Pipeline lookup and unwind
    if (query.lookup) {
        pipelines.push(query.lookup);
        pipelines.push(query.unwind);
    }

    // Pipeline group and count
    pipelines.push({
        $group: {
            _id: null,
            data: { $push: '$$ROOT' },
            count: { $sum: 1 },
        },
    });

    // Pipeline projection (limit, skip)
    let data;
    const limit = query.projection && query.projection.limit ? query.projection.limit : 0;
    const skip = query.projection && query.projection.skip ? query.projection.skip : 0;

    if (limit > 0 && skip > 0) {
        data = { $slice: ['$data', skip, limit] };
    } else if (limit > 0) {
        data = { $slice: ['$data', limit] };
    } else if (skip > 0) {
        data = { $slice: ['$data', skip, '$count'] };
    } else { data = '$data'; }

    pipelines.push({
        $project: {
            count: 1,
            data,
            limit: { $literal: limit.toString() },
            skip: { $literal: skip.toString() },
        },
    });

    // Pipeline projection (fields)
    if (query.projection && query.projection.fields) {
        const pipelineProjectionFields = {
            $project: {
                count: 1,
            },
        };

        const fields = Object.keys(query.projection.fields);
        fields.forEach((field) => {
            pipelineProjectionFields.$project[`data.${field}`] = 1; // Added to projection
        });
        pipelines.push(pipelineProjectionFields);
    }

    // Pipeline projection (hideFields)
    if (query.projection && query.projection.hideFields) {
        const pipelineProjectionHideFields = {
            $project: {
            },
        };

        const hideFields = Object.keys(query.projection.hideFields);
        hideFields.forEach((field) => {
            pipelineProjectionHideFields.$project[`data.${field}`] = 0; // Added to projection
        });
        pipelines.push(pipelineProjectionHideFields);
    }

    // Execute aggregate command in mongodb
    return collection.aggregate(pipelines).toArray();
}

module.exports.initConnection = initConnection;
module.exports.getDBConnection = getDBConnection;
module.exports.getMongooseConnection = getMongooseConnection;
module.exports.findAllAndCount = findAllAndCount;

process.on('to_close_connections', () => {
    console.error('[MongoDB] Closing connection...');

    mongoose.disconnect()
        .then(() => console.info('[MongoDB] Connection closed'))
        .catch((error) => console.error(`[MongoDB] Error closing connections: ${error}`));
});
