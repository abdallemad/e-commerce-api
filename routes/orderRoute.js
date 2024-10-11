const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission
} = require('../middleware/authentication')
const {
  createOrder,
  getAllOrder,
  getCurrentUserOrder,
  getSingleOrder,
  updateOrder,
} = require('../controllers/orderController')

router
  .route('/')
  .post(authenticateUser,createOrder)
  .get(authenticateUser,authorizePermission('admin'), getAllOrder)

router
  .route('/showMyOrders')
  .get(authenticateUser,getCurrentUserOrder);

router
  .route('/:id')
  .get(authenticateUser,getSingleOrder)
  .patch(authenticateUser,updateOrder)
module.exports = router