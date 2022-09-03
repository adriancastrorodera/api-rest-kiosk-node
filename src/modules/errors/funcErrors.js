const funcErrorNames = require('./lists/funcErrors.json');

class FunctionalError extends Error {
    constructor(errName, message) {
        super();
        Error.call(this);
        Error.captureStackTrace(this, FunctionalError);

        const self = this;
        const funcError = funcErrorNames[errName] || funcErrorNames.genericError;
        self.error = {};
        self.error.type = 'FunctionalError';
        self.error.code = funcError.errorCode;
        self.error.message = funcError.message + (message ? `:${message}` : '');
        self.error.key = errName;
        self.error.errorCode = funcError.errorCode;

        this.isClientError = () => (self.error.code >= 400 && self.error.code < 500);

        return this;
    }

    static isFunctionalError(err) {
        return (err !== undefined) && (err.error && err.error.type === 'FunctionalError');
    }
}

module.exports = FunctionalError;
