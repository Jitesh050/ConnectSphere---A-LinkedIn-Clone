const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/:id', getUserById);

module.exports = router;
