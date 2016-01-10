'use strict';

let mongohandler = require('../public/js/mongohandler.js');
let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => mongohandler.getCollection(req, res, next));

module.exports = router;