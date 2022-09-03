const express = require('express');

const router = express.Router();
const mAuthorization = require('../../../modules/authorization');
const mFormatter = require('../../../modules/formatter');
const validate = require('../../../modules/validation');

// Controllers
const endpoint = require('./endpoints');

// CRUD
router.get('/', mAuthorization.authorize, endpoint.getAll);
router.get('/count', mAuthorization.authorize, endpoint.getCount);
router.get('/:id', mAuthorization.authorize, mFormatter.paramIdToInt, endpoint.getValidation, validate, endpoint.get);
router.post('/', mAuthorization.authorize, endpoint.newValidation, validate, endpoint.new);
router.post('/load', mAuthorization.authorize, endpoint.loadValidation, validate, endpoint.load);
router.patch('/:id', mAuthorization.authorize, mFormatter.paramIdToInt, endpoint.updateValidation, validate, endpoint.update);
router.delete('/:id', mAuthorization.authorize, mFormatter.paramIdToInt, endpoint.deleteValidation, validate, endpoint.delete);

module.exports = router;
