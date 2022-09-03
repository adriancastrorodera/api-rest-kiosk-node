const util = require('util');
const { validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const mErrors = require('../errors');

/**
 * Check for errors, if there are not error, call next
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
function validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(new mErrors.FuncErrors('validationError', util.inspect(errors.array())));
    } else {
        req.validatedBody = matchedData(req, { locations: ['body'] });
        req.validatedHeaders = matchedData(req, { locations: ['headers'] });
        req.validatedParams = matchedData(req, { locations: ['params'] });
        req.validatedQuery = matchedData(req, { locations: ['query'] });
        next();
    }
}

module.exports = validate;
