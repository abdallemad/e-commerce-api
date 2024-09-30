const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication')
const {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController');
const { update } = require('../models/User');

router.route('/').get(authenticateUser,getAllUsers);
router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword);
// when dealing with parameter you should make it at the end to avoid
router.route('/:id').get(authenticateUser, getSingleUsers);

module.exports = router