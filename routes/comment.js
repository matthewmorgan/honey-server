'use strict';

let mongohandler = require('../public/js/mongohandler.js');
let express = require('express');
let router = express.Router();

router.get('/mongoid/:id', (req, res, next) => mongohandler.fetchAnObjectByMongoId(req, res, next));

router.get('/random', (req, res, next) => mongohandler.fetchARandomComment(req, res, next));

router.post('/', (req, res, next) => mongohandler.createObject(req, res, next));

router.put('/', (req, res, next) => mongohandler.updateObject(req, res, next));

router.delete('/', (req, res, next) => mongohandler.deleteObject(req, res, next));

module.exports = router;
