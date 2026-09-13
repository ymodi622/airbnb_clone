'use strict';
const { Router } = require('express');
const { getListing, paramsSchema } = require('../controllers/listings.controller');
const validate = require('../middleware/validate');

const router = Router();

router.get('/:id', validate({ params: paramsSchema }), getListing);

module.exports = router;
