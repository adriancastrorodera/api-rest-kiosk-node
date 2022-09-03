const httpErrorNames = require('./lists/httpErrors.json');

class HttpError extends Error {
    constructor(statusCode, message, stack = null) {
        super();
        Error.call(this);
        const self = this;

        if (!stack) { Error.captureStackTrace(this, HttpError); } else { self.stack = stack; }

        self.error = {};
        self.error.type = 'HttpError';
        self.error.code = statusCode;
        self.error.message = message || '';
        self.error.key = message;
        self.name = httpErrorNames[statusCode] ? httpErrorNames[statusCode] : httpErrorNames[500];

        this.isClientError = () => (self.error.code >= 400 && self.error.code < 500);

        return this;
    }

    static isHttpError(err) {
        return (err !== undefined) && (err.error && err.error.type === 'HttpError');
    }
}

module.exports = HttpError;
