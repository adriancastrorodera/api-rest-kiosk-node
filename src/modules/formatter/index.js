// Load libraries

/**
 * Allows to convert id string param to int
 * @param {Object} req Request of middleware
 * @param {Object} res Response of middleware
 * @param {function} next Express next
 */
module.exports.paramIdToInt = (req, res, next) => {
    // eslint-disable-next-line radix
    req.params.id = parseInt(req.params.id);
    next();
};
