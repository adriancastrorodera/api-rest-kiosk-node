/* eslint-disable no-underscore-dangle */

const expressValidator = require('express-validator');
const endpoints = require('../../../src/rcm/routes/publisherRoutes/endpoints');
const responses = require('../../__mocks__/responses');
const mongodbmock = require('../../__mocks__/mongodb_load');

let publisherCreated;
const reqTemplate = {
    body: {},
    params: {},
    query: {},
};
const PUBLISHER_ID = 1;
const PUBLISHER_NAME = 'John Smith';
const middlewareValidator = expressValidator({});

describe('Publisher Router tests', () => {
    beforeAll(async (done) => {
        // Mute logs
        global.console = {
            ...console,
            debug: jest.fn(),
            info: jest.fn(),
            error: jest.fn(),
        };
        await mongodbmock.connect();
        done();
    });

    afterAll(async (done) => {
        jest.clearAllMocks();
        await mongodbmock.disconnect();
        done();
    });
    describe('createPublisher', () => {
        test('Should create a new publisher in the system without error', async (done) => {
            const req = { ...reqTemplate };
            req.validatedBody = {
                id: PUBLISHER_ID,
                name: PUBLISHER_NAME,
            };
            const next = responses.next_ok(done); // To initialize next
            const res = {
                json: (response) => {
                    expect(response).toHaveProperty('data');
                    publisherCreated = response.data;
                    done();
                },
            };

            middlewareValidator(req, res, next);
            endpoints.new(req, res, next);
        });

        test('Should get the new publisher saved in the system without error', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                id: PUBLISHER_ID,
            };
            const next = responses.next_ok(done); // To initialize next
            const res = {
                json: (response) => {
                    expect(response).toHaveProperty('data');
                    expect(response).toHaveProperty('data.id');
                    expect(response).toHaveProperty('data.name');
                    expect(response.data.id).toBe(publisherCreated.id);
                    expect(response.data.name).toBe(publisherCreated.name);
                    done();
                },
            };

            middlewareValidator(req, res, next);
            endpoints.get(req, res, next);
        });

        test('Should get all publishers (3) saved in the system without error', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                id: PUBLISHER_ID,
            };
            const next = responses.next_ok(done); // To initialize next
            const res = {
                json: (response) => {
                    expect(Array.isArray(['data'])).toBeTruthy();
                    expect(response.data).toHaveLength(3);
                    done();
                },
            };

            endpoints.getAll(req, res, next);
        });

        test('Should get all publishers (1) saved in the system without error and filter skip = 1', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                id: PUBLISHER_ID,
            };
            req.query = {
                skip: 1,
            };
            const next = responses.next_ok(done); // To initialize next
            const res = {
                json: (response) => {
                    expect(Array.isArray(['data'])).toBeTruthy();
                    expect(response.data).toHaveLength(2);
                    done();
                },
            };

            endpoints.getAll(req, res, next);
        });

        test('Should update a publisher already saved in the system without error', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                id: PUBLISHER_ID,
            };
            req.validatedBody = {
                name: 'New name',
            };
            const next = responses.next_ok(done); // To initialize next
            const res = {
                json: (response) => {
                    expect(response).toHaveProperty('data');
                    expect(response.data.name).toBe('New name');
                    done();
                },
            };

            middlewareValidator(req, res, next);
            endpoints.update(req, res, next);
        });

        test('Should delete a publishers saved in the system without error', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                id: PUBLISHER_ID,
            };
            const res = responses.res_ok_delete(done);
            const next = responses.next_ok(done); // To initialize next

            middlewareValidator(req, res, next);
            endpoints.delete(req, res, next);
        });

        test('Should return an error trying to delete a publisher already deleted', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                id: PUBLISHER_ID,
            };
            const next = responses.next_throw_error(done);
            const res = responses.next_resource_not_found(done);

            middlewareValidator(req, res, next);
            endpoints.delete(req, res, next);
        });

        test('Should return validation error for missing param.id', async (done) => {
            const req = { ...reqTemplate };
            req.params = {
                wrong: PUBLISHER_ID,
            };
            const next = responses.next_resource_not_found(done);
            // Only for give a value to res, the error happen in validation, only next is call
            const res = responses.res_ok_delete(done);

            middlewareValidator(req, res, next);
            responses.simulateExpressValidator(
                endpoints.deleteValidation,
                req, res, next,
            );
            endpoints.delete(req, res, next);
        });
    });
});
