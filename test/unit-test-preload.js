/* eslint-disable global-require */
const jestMongoSetup = require('@shelf/jest-mongodb/setup');
const mongodbmock = require('./__mocks__/mongodb_load');

module.exports = async () => {
    await jestMongoSetup();
    await mongodbmock.load();
};
