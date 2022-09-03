/* eslint-disable max-len */

// Load libraries
const { body, param } = require('express-validator/check');
const publisherController = require('../../controllers/publisherController');
const response = require('../../../modules/response');

/**
 * Get all publishers
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.getAll = (req, res, next) => {
    response.standardListPromise(publisherController.getAll(req), req, res, next);
};

module.exports.getValidation = [
    param('id').isNumeric(),
];

/**
 * Get a publisher by id
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.get = (req, res, next) => {
    const { id } = req.params;

    response.standardDataPromise(publisherController.get(id), req, res, next);
};

/**
 * Get the number of publisher in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.getCount = (req, res, next) => {
    response.standardDataPromise(publisherController.getCount(), req, res, next);
};

module.exports.newValidation = [
    body('id').isNumeric(),
    body('name').isString(),
];

/**
 * Save a publisher in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.new = (req, res, next) => {
    const data = req.validatedBody;

    response.standardDataPromise(publisherController.new(data), req, res, next);
};

module.exports.updateValidation = [
    body('name').isString(),
];

/**
 * Update a publisher in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.update = (req, res, next) => {
    const { id } = req.params;
    const data = req.validatedBody;

    response.standardDataPromise(publisherController.update(id, data), req, res, next);
};

module.exports.deleteValidation = [
    param('id').isNumeric(),
];

/**
 * Delete a publisher in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.delete = (req, res, next) => {
    const { id } = req.params;

    response.standardDeletePromise(publisherController.delete(id), req, res, next);
};

module.exports.loadValidation = [
    body('from').isNumeric(),
    body('to').isNumeric(),
];
/**
 * Save examples of newspaper in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.load = (req, res, next) => {
    const data = req.validatedBody;

    response.standardDataPromise(publisherController.load(data.from, data.to), req, res, next);
};
