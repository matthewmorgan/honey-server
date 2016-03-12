'use strict';

let mongohandler = require('../public/js/mongohandler.js');
let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => mongohandler.getCollection(req, res, next));

router.get('/all', (req, res, next) => mongohandler.fetchAllComments(req, res, next));

router.get('/shuffled', (req, res, next) => mongohandler.fetchAllComments(req, res, next));

router.put('/', (req, res, next) => mongohandler.updateComments(req, res, next));

module.exports = router;
