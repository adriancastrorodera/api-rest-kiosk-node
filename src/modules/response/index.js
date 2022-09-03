/** ****************************************
    Module: Differents generic middlewares
    Description: Differents generic middlewares to use from anywhere
******************************************* */

/* eslint-disable no-param-reassign */
// Load libraries
const mErrors = require('../errors');

// PRIVATE
/**
 * Standard api response to lists
 * .
 * @param {Object} req Request of middleware
 * @param {Object} res Response of middleware
 */
function responseList(res, next, err, result) {
    if (err) {
        next(err);
    } else {
        const data = result.data || [];
        res.json({
            data,
            limit: result.limit ? parseInt(result.limit, 10) : 0,
            skip: result.skip ? parseInt(result.skip, 10) : 0,
            total: data.length,
        });
    }
}

/**
 * Allows to handle an api request as promise response
 * @param {*} controller app controller
 * @param {*} req Request of middleware
 * @param {*} res Request of middleware
 * @param {*} next Express next
 */
function standardListPromise(controller, req, res, next) {
    controller.then((result) => {
        responseList(res, next, null, result);
    }).catch((error) => {
        if (!mErrors.FuncErrors.isFunctionalError(error)
            && !mErrors.HttpErrors.isHttpError(error)) {
            error = new mErrors.HttpErrors(500, error.message, error.stack);
        }
        responseList(res, next, error);
    });
}

/**
 * Standard api response
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} err Some error
 * @param {*} result Some result
 */
function responseData(res, next, err, result) {
    if (err) {
        next(err);
    } else {
        res.json({ data: result });
    }
}

/**
 * Standard api response
 * @param {*} controller app controller
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
function standardDataPromise(controller, req, res, next) {
    controller.then((result) => {
        responseData(res, next, null, result);
    }).catch((error) => {
        if (!mErrors.FuncErrors.isFunctionalError(error)
            && !mErrors.HttpErrors.isHttpError(error)) {
            error = new mErrors.HttpErrors(500, error.message, error.stack);
        }
        responseData(res, next, error);
    });
}

/**
 * Standard api response to delete
 * @param {Object} res Response of middleware
 * @param {Object} next Express next
 * @param {Object} err Some error
 */
function responseDelete(res, next, err) {
    if (err) {
        next(err);
    } else {
        res.status(204).send();
    }
}

/**
 * Standard api response
 * @param {*} controller app controller
 * @param {*} req Request of middleware
 * @param {*} res Response of middleware
 * @param {*} next Express next
 */
function standardDeletePromise(controller, req, res, next) {
    controller.then((result) => {
        responseDelete(res, next, null, result);
    }).catch((error) => {
        if (!mErrors.FuncErrors.isFunctionalError(error)
            && !mErrors.HttpErrors.isHttpError(error)) {
            error = new mErrors.HttpErrors(500, error.message, error.stack);
        }
        responseDelete(res, next, error);
    });
}

// PUBLIC
module.exports.standardList = responseList;
module.exports.standardData = responseData;
module.exports.standardDataPromise = standardDataPromise;
module.exports.standardDeletePromise = standardDeletePromise;
module.exports.standardListPromise = standardListPromise;
