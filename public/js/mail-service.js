'use strict';
let superagent = require('superagent');
let https = require("https");
let md5 = require("md5");

let host = 'us12.api.mailchimp.com';
let listPath = '3.0/lists/8e52414c3b/members';   //embeds the list we want
let user = process.env.CHIMP_USER;
let key = process.env.CHIMP_KEY;

let getMembers = (req, res, next, callback) => {

  superagent
      .get([host, listPath].join('/'))
      .auth(user, key)
      .end((err, result) => {
        if (err) {
          next(err);
        } else if (callback && typeof callback === 'function'){
          callback();
        } else {
          res.send(result.text);
        }
      })
};


let addMember = (req, res, next, callback) => {
  let data = req.body;
  let name = req.body.name.split(' ');
  let emailObject = {
    email_address: data.email,
    status:        "subscribed",
    merge_fields:  {
      FNAME: name[0] || 'firstname',
      LNAME: name[1] || 'lastname'
    }
  };
  console.log('emailObject ', emailObject);
  superagent
      .post([host, listPath].join('/'))
      .auth(user, key)
      .send(emailObject)
      .end((err, result) => {
        if (err) {
          next(err);
        } else {
          if (callback && typeof callback === 'function') {
            callback();
          } else {
            res.send(result.text);
          }
        }
      })
};

let addOrUpdateMember = (req, res, next, callback) => {
  let data = req.body;
  let name = req.body.name.split(' ');
  let emailObject = {
    email_address: data.email.trim(),
    status:        "subscribed",
    merge_fields:  {
      FNAME: name[0] || 'firstname',
      LNAME: name[1] || 'lastname'
    }
  };

  let emailHash = md5(emailObject.email_address.toLowerCase());

  function addMember() {
    superagent
        .post([host, listPath].join('/'))
        .auth(user, key)
        .send(emailObject)
        .end((err, result) => {
          if (err) {
            console.log('error in addMember: ',err);
            next(err);
          } else {
            result.emailObject = emailObject;
            console.log('running callback for addMember');
            if (callback && typeof callback === 'function') {
              callback(null, result);
            } else {
              res.send(result.text);
            }
          }
        })
  };
  console.log('emailObject ', emailObject);
  console.log('attempting to PUT (update) member of email list');
  superagent
      .put([host, listPath, emailHash].join('/'))
      .auth(user, key)
      .send(emailObject)
      .end((err, result) => {
        if (err) {
          console.log('adding new member to email list');
          addMember()
        } else {
          result.emailObject = emailObject;
          if (callback && typeof callback === 'function') {
            callback(null, result);
          } else {
            res.send(result.text);
          }
        }
      })

};

let updateMember = (req, res, next, callback) => {
  let data = req.body.emailObject;
  let emailHash = md5(data.email_address);

  superagent
      .put([host, listPath, emailHash].join('/'))
      .auth(user, key)
      .send(data)
      .end((err, result) => {
        if (err) next(err);
        if (callback && typeof callback === 'function') {
          callback();
        }
        res.send(result.text);
      })
};

exports.list = (req, res, next) => getMembers(req, res, next, null);
exports.add = (req, res, next, callback) => addMember(req, res, next, callback);
exports.addOrUpdate = (req, res, next, callback) => addOrUpdateMember(req, res, next, callback);
exports.update = (req, res, next) => updateMember(req, res, next, null);