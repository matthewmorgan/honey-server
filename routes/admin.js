/**
 * Created by matt on 2/27/16.
 */
'use strict';

let router = require('express').Router();

router.post('/login', (req, res, next) => {
  const payload = req.body;
  if(payload.username === 'matt' && payload.password === 'morgan'){
    res.send(200);
  } else {
    res.send(403);
  }
});

module.exports = router;