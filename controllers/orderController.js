const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomErrors = require('../errors');
const {checkPermission} = require('../utils');
const {StatusCodes} =require('http-status-codes');
const { default: Stripe } = require('stripe');

const stripe = new Stripe(process.env.STRIPE_API_SECRET)

const createOrder = async(req,res)=>{
  const {items:cartItems,shippingFee,tax} = req.body
  if(!cartItems || cartItems.length<1)
    throw new CustomErrors.BadRequestError(`please provide cartItems`);
  if(!tax || !shippingFee)
    throw new CustomErrors.BadRequestError('please provide tax and shippingFee')

  let orderItems = [];
  let subTotal = 0;
  for(const item of cartItems){
    const dbProduct = await Product.findOne({_id:item.product})
    if(!dbProduct)
      throw new CustomErrors.NotFoundError(`there is no product match this id: ${item.product}`);
    const {name , image, _id , price} = dbProduct
    const singleOrderItem = {
      name,
      image,
      price,
      product:_id,
      amount:item.amount,
    }
    orderItems = [...orderItems,singleOrderItem];
    subTotal += price * singleOrderItem.amount;
  }
  const total = subTotal + shippingFee + tax;
  const {
    client_secret,
    id:paymentIntentId
  } = await stripe.paymentIntents.create({
    amount:total,
    currency:"usd"
  })
  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    user:req.user.id,
    clientSecrete:client_secret,
    paymentIntentId
  })
  res.status(StatusCodes.CREATED).json({order})
}


const getAllOrder = async (req,res)=>{
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({orders})
}

const getSingleOrder = async(req,res)=>{
  const {id} = req.params;
  const order = await Order.findOne({_id:id})
  if(!order) 
    throw new CustomErrors.NotFoundError(`there is no order match this id: ${id}`)
  checkPermission(req.user,order.user);
  res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrder = async(req,res)=>{
  const {id} = req.user
  const orders = await Order.find({user:id})

  res.status(StatusCodes.OK).json({orders})
}
const updateOrder = async(req,res)=>{
  const {id:orderId} = req.params;
  const order = await Order.findOne({_id:orderId})
  const {paymentIntentId} = req.body;
  if(!paymentIntentId)
    throw new CustomErrors.BadRequestError('please provide payment intent id');
  if(!order)
    throw new CustomErrors.NotFoundError(`no order match this id: ${orderId}`);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';

  await order.save();
  res.send('order updated route');
}

module.exports = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder
}