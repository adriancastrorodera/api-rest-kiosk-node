/** ****************************************
    Module: errors
    Description: Errors manager
******************************************* */

const HttpErrors = require('./httpErrors');
const FuncErrors = require('./funcErrors');

// PRIVATE

/**
 * Generate error object
 * @param {Object} err Some error
 * @returns error
 */
function generateErrorObject(err) {
    let oError = err;

    if (HttpErrors.isHttpError(err)) {
        oError.error.code = oError.error.code || 500;
        if ((oError.error.code >= 400) && (oError.error.code < 500)) {
            oError.success = false;
        }
        oError.error.critical = (oError.error.code >= 500);
    } else if (FuncErrors.isFunctionalError(err)) {
        oError.success = false;
    } else if (err.status) {
        oError.success = false;
        oError.error.message = oError.error.message ? oError.error.message : 'uncaught error';
        oError.error.code = err.status;
        oError.error.critical = true;
    } else {
        oError = new HttpErrors(500, err);
        oError.success = false;
        oError.error.message = oError.error.message ? oError.error.message : 'uncaught error';
        oError.error.code = 500;
        oError.error.critical = true;
    }
    return oError;
}

// PUBLIC

// Handler errors middleware
function errorHandler(err, req, res, next) {
    const oError = generateErrorObject(err);

    // Response to endpoint
    res.status(oError.error.code);
    res.json(oError);

    // Logs
    const errorMsgLog = {
        statusCode: oError.error.code,
        errorName: oError.name,
        errorType: oError.error.type,
        errorMessage: oError.error.message,
    };

    // Trace stack if error is 500
    if (oError.error.code === 500) {
        console.error(errorMsgLog, oError.error.message);
        next(err);
    } else {
        console.debug(errorMsgLog, oError.error.message);
    }
}

// 404 errors middleware (not found)
function pageNotFound(req, res, next) {
    const error = new HttpErrors(404, 'pageNotFound');
    next(error);
}

// Parse body-to-Json error middleware
function parseError(err, req, res, next) {
    const message = `Error parsing request body: ${err.message}. [request body]: ${err.body}`;
    const error = new HttpErrors(404, message);
    next(error);
}

module.exports.HttpErrors = HttpErrors; // Constructor
module.exports.FuncErrors = FuncErrors; // Constructor
module.exports.errorHandler = errorHandler;
module.exports.pageNotFound = pageNotFound;
module.exports.parseError = parseError;
