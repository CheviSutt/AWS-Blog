const express = require("express");
const ControllerPost = require('../controllers/posts');

const confirmAuth = require('../middleware/compare-auth.js');
const fileExtract = require('../middleware/multer-file.js');

const router = express.Router();

router.post(
  "",
  confirmAuth, // executed in compare-auth.js
  fileExtract,
  ControllerPost.postCreate
);

router.put( // Update path/route
  '/:id',
  confirmAuth, // executed in compare-auth.js
  fileExtract,
  ControllerPost.postUpdate
);

router.get("", ControllerPost.getPosts);

router.get("/:id", ControllerPost.getPost);

router.delete("/:id", confirmAuth, ControllerPost.postDelete);// executed in compare-auth.js

module.exports = router;


