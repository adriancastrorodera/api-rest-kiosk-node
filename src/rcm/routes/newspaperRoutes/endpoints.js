/* eslint-disable max-len */

// Load libraries
const { body, param } = require('express-validator/check');
const newspaperController = require('../../controllers/newspaperController');
const response = require('../../../modules/response');

/**
 * Get all newspapers
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.getAll = (req, res, next) => {
    response.standardListPromise(newspaperController.getAll(req), req, res, next);
};

module.exports.getValidation = [
    param('id').isNumeric(),
];

/**
 * Get a newspaper by id
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.get = (req, res, next) => {
    const { id } = req.params;

    response.standardDataPromise(newspaperController.get(id), req, res, next);
};

/**
 * Get the number of newspaper in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.getCount = (req, res, next) => {
    response.standardDataPromise(newspaperController.getCount(), req, res, next);
};

module.exports.newValidation = [
    body('id').isNumeric(),
    body('title').isString(),
    body('image').isString(),
    body('link').isString(),
    body('publisherId').isNumeric(),
    body('languages').isArray(),
    body('languages.*').isString().isIn(['en', 'es', 'fr', 'de']),
];

/**
 * Save a newspaper in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.new = (req, res, next) => {
    const data = req.validatedBody;

    response.standardDataPromise(newspaperController.new(data), req, res, next);
};

module.exports.updateValidation = [
    body('title').isString(),
    body('image').isString(),
    body('link').isString(),
    body('publisherId').isNumeric(),
    body('languages').isArray(),
    body('languages.*').isString().isIn(['en', 'es', 'fr', 'de']),
];

/**
 * Update a newspaper in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.update = (req, res, next) => {
    const { id } = req.params;
    const data = req.validatedBody;

    response.standardDataPromise(newspaperController.update(id, data), req, res, next);
};

module.exports.deleteValidation = [
    param('id').isNumeric(),
];

/**
 * Delete a newspaper in the system
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
module.exports.delete = (req, res, next) => {
    const { id } = req.params;

    response.standardDeletePromise(newspaperController.delete(id), req, res, next);
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

    response.standardDataPromise(newspaperController.load(data.from, data.to), req, res, next);
};
