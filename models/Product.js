const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:[true,'please provide name'],
    maxlength:[100,'name cant be more than 100 chars'],
  },
  description:{
    type:String,
    required:[true,'please provide product description'],
    maxlength:[1000,'description cant be more than 1000 chars'],
  },
  price:{
    type:Number,
    required:[true,'please provide price'],
    default:0,
  },
  image:{
    type:String,
    default:'/uploads/example.jbg'
  },
  category:{
    type:String,
    required:[true,'please provide product category'],
    enum:['office','kitchen','bedroom'],
  },
  company:{
    type:String,
    required:[true,'please provide product company'],
    enum:{
      values:['ikea','liddy','marcos'],
      message:'{VALUE} is not supported',
    }
  },
  colors:{
    type:[String],
    required:[true,'please provide the colors'],
    default:['#222']

  },
  featured:{
    type:Boolean,
    default:false
  },
  freeShipping:{
    type:Boolean,
    default:false,
  }
  ,
  inventory:{
    type:Number,
    required:true,
    default: 15,
  },
  averageRating:{
    type:Number,
    default:0
  },
  user:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true
  }
},{
  timestamps:true,
  toJSON:{
    virtuals:true,
  }
})

ProductSchema.virtual('reviews',{
  ref:'Review',
  localField:'_id',
  foreignField:'product',
  justOne:false
})
ProductSchema.pre('remove',async function(next){
  await this.model('Review').deleteMany({product:this._id})
})

module.exports = mongoose.model('Product',ProductSchema)