'use strict';

let router = require('express').Router();

let mongohandler = require('../public/js/mongohandler.js');

router.post('/', (req, res, next) => mongohandler.createObject(req, res, next));


router.delete('/', (req, res, next) => mongohandler.deleteObject(req, res, next));

module.exports = router;
