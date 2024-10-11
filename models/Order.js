const mongoose = require('mongoose');

const SingleOrderItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  amount:{
    type:Number,
    required:true,
  },
  product:{
    type:mongoose.Types.ObjectId,
    ref:"Product",
    required:true
  }
})


const OrderSchema = new mongoose.Schema({
  tax:{
    type:Number,
    required:true
  },
  shippingFee:{
    type:Number,
    required:true
  },
  subTotal:{
    type:Number,
    required:true
  },
  total:{
    type:Number,
    required:true
  },
  orderItems:[SingleOrderItemSchema],
  status:{
    type:String,
    enum:['pending','failed','payed','delivered','cancel'],
    default:'pending'
  },
  user:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  },
  clientSecrete:{
    type:String,
    required:true,
  },
  paymentIntentId:{
    type:String,
    required:true,
  }
},{timestamps:true})

module.exports = mongoose.model("Order",OrderSchema);