/**
 * Created by matt on 2/27/16.
 */
'use strict';

let express = require('express');
let router = express.Router();

router.post('/login', (req, res, next) => {
  const payload = req.body;
  return (payload.username === 'matt' && payload.password === 'morgan');
});