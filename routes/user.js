'use strict';

let router = require('express').Router();

let mongohandler = require('../public/js/mongohandler.js');
let mailservice = require('../public/js/mail-service.js');

router.get('/id/:id', (req, res, next) => mongohandler.fetchAUserById(req, res, next));
router.get('/mongoid/:_id', (req, res, next) => mongohandler.fetchAnObjectByMongoId(req, res, next));
router.get('/email/:email', (req, res, next) => mongohandler.fetchAUserByEmail(req, res, next));

// for this application, email is the unique identifier of users.  Once an email is registered, other data may be changed, but
// the email remains connected with the _id
router.post('/', (req, res, next) => {
  mailservice.addOrUpdate(req, res, next, function(err, result){
    if (err) {
      next(err)
    } else {
      req.emailObject = result.emailObject;
      mongohandler.updateObjectByEmail(req, res, next)
    }
  });
});

router.delete('/', (req, res, next) => mongohandler.deleteObject(req, res, next));

module.exports = router;
