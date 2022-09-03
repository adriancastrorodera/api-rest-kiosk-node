const validate = require('../../src/modules/validation');

module.exports.next_ok = (done) => (err) => {
    if (err) {
        done(err);
    }
};

module.exports.next_validation_error = (done) => (err) => {
    if (err) {
        expect(err.error.key).toEqual('validationError');
        done();
    }
};

module.exports.next_resource_not_found = (done) => (err) => {
    if (err) {
        expect(err.error.code).toEqual(404);
        done();
    }
};

module.exports.next_throw_error = (done) => (err) => {
    if (err) {
        done();
    }
};

module.exports.res_ok_delete = (done) => ({
    json: (response) => {
        done(response);
    },
    status: (status) => {
        expect(status).toEqual(204);
        done();

        return {
            send: () => { },
        };
    },
});

module.exports.simulateExpressValidator = (validatorArr, req, res, next) => {
    for (let i = 0; i < validatorArr.length; i += 1) {
        validatorArr[i](req, res, next);
    }

    validate(req, res, next);
};
