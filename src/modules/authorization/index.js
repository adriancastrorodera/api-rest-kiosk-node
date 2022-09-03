/**
 * Example of authorization middleware. Do nothing.
 * @param {Object} req Request of middleware
 * @param {Object} res Response of middleware
 * @param {function} next Express next
 */
module.exports.authorize = (req, res, next) => {
    next();
};
