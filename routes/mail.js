'use strict';

let router = require('express').Router();

let mongohandler = require('../public/js/mongohandler.js');
let mailservice = require('../public/js/mail-service.js');

router.get('/', (req, res, next) => res.sendStatus(200));

router.get('/list', (req, res, next) => mailservice.list(req, res, next));
router.post('/add', (req, res, next) => mailservice.add(req, res, next));
router.put('/update', (req, res, next) => mailservice.update(req, res, next));

module.exports = router;