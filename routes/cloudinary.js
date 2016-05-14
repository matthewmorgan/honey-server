'use strict';

let express = require('express');
let router = express.Router();
let cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'hztzss4vs',
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET

});

router.get('/getusage', (req, res, next) => {
  cloudinary.api.usage((result) => {
    res.json(result);
  });
});

let randomElement = (myArray) => myArray[Math.floor(Math.random() * myArray.length)];

router.get('/imagegallery', (req, res, next) => {
  cloudinary.api.resources_by_moderation('manual', 'approved',
      (result) => res.json(result.resources), {
        transformation: { width: 600, height: 600, crop: 'fill'},
        tags: 'true'
  });
});

router.get('/randomimages/:count', (req, res, next) => {
  cloudinary.api.resources_by_moderation('manual', 'approved',
      (result) => {
        {
          let selectedElements = [];
          let maxResults = Math.min(req.params.count, result.resources.length);
          while (selectedElements.length < maxResults) {
            let selection = randomElement(result.resources);
            if (selectedElements.indexOf(selection) === -1) {
              selectedElements.push(selection);
            }
          }
          res.json(selectedElements);
        }
      },
      {tags: 'true'});
});

router.get('/approvedimages', (req, res, next) => {
  cloudinary.api.resources_by_moderation('manual', 'approved',
      (result) => {
        res.json(result)
      },
      {tags: 'true'});
});

router.delete('/:id', (req, res, next) => {
  console.log('id ', req.params.id);
  cloudinary.uploader.destroy(req.params.id, (result) => {
    console.log(result);
    res.sendStatus(result.result === 'ok' ? 200 : 500);
  });
});


router.put('/updatecaption', (req, res, next) => {
  let tags = decodeURIComponent(req.query.tags);
  let public_id = req.query.public_id;
  console.log('updating image: ', public_id);
  console.log('tag values: ', tags);
  cloudinary.api.update(public_id, (result) => {
    res.send(result);
  }, {tags: tags});

});


module.exports = router;
