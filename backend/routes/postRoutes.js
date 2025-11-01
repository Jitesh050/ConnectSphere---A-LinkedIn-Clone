const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUser,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.route('/').get(getPosts).post(protect, upload.single('image'), createPost);
router.route('/user/:userId').get(getPostsByUser);
router
  .route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.route('/:id/like').post(protect, toggleLike);

module.exports = router;
