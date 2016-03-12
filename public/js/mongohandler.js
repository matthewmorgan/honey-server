'use strict';

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const uri = process.env.MONGO_URL;
//const uri = 'mongodb://localhost/honeycreek';
const getDB = () => mongodb.connect(uri);  //getDB returns a Promise that resolves to the DB.
console.log('MONGO_URL '+process.env.MONGO_URL);
console.log('listenting to mongo service on '+uri);
exports.close = () => {
  getDB()
      .then(db => db.close());
};

exports.fetchARandomComment = (req, res, next) => {
  mongodb.connect(uri, function (err, db) {
    db.collection('users').count({"messageApproved": true}, function (err, count) {
      if (err) next(err);
      const randomCount = Math.floor(Math.random() * count);
      db.collection('users')
          .find({messageApproved: true, message: {$ne: ""}})
          .limit(-1)
          .skip(randomCount)
          .next(function (err, result) {
            if (err) next(err)
            let message = (result && result.message) ? (result.message + ' - ' + result.name + ', ' + result.affiliation) : '';
            res.send(message);
          })
    })
  })
};

exports.fetchNamesOfAttendees = (req, res, next) => {
  mongodb.connect(uri,  (err, db) =>  {
    db.collection('users')
        .find({isAttending: "true"}, (err, cursor) => {
          if (err) next(err);
          cursor.toArray((err, result) => {
            const attendees = result.map((user) =>{
              return user.name;
            });
            res.json(attendees)
          });
        })
  })
};

exports.fetchAllComments = (req, res, next) => {
  mongodb.connect(uri,  (err, db) =>  {
      db.collection('users')
          .find({messageApproved: true, message: {$ne: ""}}, (err, cursor) => {
            if (err) next(err);
            cursor.toArray((err, result) => {
              const comments = result.map((user) =>{
                return (user && user.message) ? (user.message + ' - ' + user.name + ', ' + user.affiliation) : '';
              });
              res.json(comments)
            });
          })
    })
};

exports.fetchAUserById = (req, res, next) => {
  const fetchById = (db) => {
    db.collection('users')
        .find({'id': req.params.id})
        .limit(1)
        .next()
        .then((result) => res.send(result || {}))
        .catch((err) => next(err));
  };

  getDB().then(fetchById);
};

exports.fetchAUserByEmail = (req, res, next) => {
  const fetchByEmail = (db) => {
    var userEmail = decodeURIComponent(req.params.email);
    db.collection('users')
        .find({'email': userEmail})
        .limit(1)
        .next()  //findOne is deprecated!
        .then((result) => res.send(result || {}))
        .catch((err) => next(err));
  };

  getDB().then(fetchByEmail);
};

exports.fetchAnObjectByMongoId = (req, res, next) => {
  const collectionName = req.baseUrl.match(/\w+/g).pop() + 's';
  const fetchByMongoId = (db) => {
    db.collection(collectionName)
        .find({_id: ObjectId(req.params._id)})
        .limit(1)
        .next()
        .then((result) => res.send(result || {}))
        .catch((err) => next(err));
  };

  getDB().then(fetchByMongoId);
};

exports.createObject = (req, res, next) => {
  const collectionName = req.baseUrl.match(/\w+/g).pop() + 's';

  const createObject = (db) => {
    db.collection(collectionName)
        .insertOne(req.body)
        .then((result) => res.send(result.insertedId))
        .catch((err) => next(err));
  };

  getDB().then(createObject)
  .catch((err) => console.log(err));
};


exports.updateComments = (req, res, next) => {
  const comments = req.body;

  const approvedComments = comments.filter(comment => comment.messageApproved);
  const approvedIds = approvedComments.map(comment => ObjectId(comment._id));

  const rejectedComments = comments.filter(comment => !comment.messageApproved);
  const rejectedIds = rejectedComments.map(comment => ObjectId(comment._id));

  const doUpdates = (db) => {
    db.collection('users')
        .updateMany(
        {_id: {$in: approvedIds}},
        {$set: {messageApproved: true}}, (err, result) => {
          if (err) next(err);
          db.collection('users')
              .updateMany(
              {_id: {$in: rejectedIds}},
              {$set: {messageApproved: false}}, (err, result) => {
                if (err) next(err);
                res.send(result);
              })
        })

  };

  getDB()
      .then(doUpdates)

};


exports.updateObjectByEmail = (req, res, next) => {
  const doc = req.body;

  //any changes require re-approval by moderator
  doc.messageApproved=false;
  const email = doc.email;

  const collectionName = req.baseUrl.match(/\w+/g).pop() + 's';

  const updateDoc = (db) => {
    db.collection(collectionName)
        .findOneAndUpdate({email: email}, {$set: doc}, {upsert: true, returnOriginal: false})
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          next(err)
        })
  };

  getDB().then(updateDoc);
};

exports.clearCollection = (req, res, next) => {
  const collectionName = req.baseUrl.match(/\w+/g).pop() + 's';

  const clearCollectionByName = (db) => {
    db.collection(collectionName)
        .deleteMany({})
        .then((result) => res.send(result))
        .catch((err) => next(err));
  };

  getDB().then(clearCollectionByName);
};

exports.getCollection = (req, res, next) => {
  const collectionName = req.baseUrl.match(/\w+/g).pop();

  const fetchCollection = (db) => {
    const docs = [];
    db.collection(collectionName)
        .find()
        .stream()
        .on('data', (data) => docs.push(data))
        .on('error', (err) => next(err))
        .on('end', () => res.json(docs))
  };

  getDB().then(fetchCollection);
};

exports.deleteObject = (req, res, next) => {
  const collectionName = req.baseUrl.match(/\w+/g).pop() + 's';
  const _id = req.body._id;
  const deleteObject = (db) => {
    db.collection(collectionName)
        .deleteOne({_id: ObjectId(_id)})
        .then((result) => res.json(result))
        .catch((err) => next(err))
  };
  getDB().then(deleteObject);
};

