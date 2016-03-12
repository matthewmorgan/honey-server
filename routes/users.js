'use strict';

let router = require('express').Router();

let mongohandler = require('../public/js/mongohandler.js');

router.get('/', (req, res, next) => mongohandler.getCollection(req, res, next));
router.get('/attending', (req, res, next) => {
  mongohandler.fetchNamesOfAttendees(req, res, next);
});

module.exports = router;
