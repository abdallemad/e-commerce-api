const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please provide title'],
    trim: true,
    maxlength: 100,
  },
  rating: {
    type: Number,
    required: [true, 'please give rating for the product'],
    default: 4.5,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    required: [true, 'please provide comment'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true, // Add required if user must be provided
  },
  product: {
    type: mongoose.Types.ObjectId, // Corrected from 'types' to 'type'
    ref: 'Product',
    required: true, // Add required if product must be provided
  },
}, { timestamps: true });

// Fixed index (it should be `user`, not `users`)
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function(productId){
  const result = await this.aggregate([
    {
      $match:{
        product:productId,
      }
    },
    {
      $group:{
        _id: null,
        averageRating: {
          $avg:'$rating'
        },
        numOfReviews:{
          $sum:1
        }
      }
    }
  ])
  await this.model("Product").findOneAndUpdate({_id:productId},{
    averageRating:Math.ceil(result[0]?.averageRating || 0),
    numOfReviews:result[0]?.numOfReviews || 0 ,
  })
}

ReviewSchema.post('save',async function(next){
  await this.constructor.calculateAverageRating(this.product)
  console.log('save hock');
})
ReviewSchema.post('remove',async function(next){
  await this.constructor.calculateAverageRating(this.product)
  console.log('removed hock');
})

module.exports = mongoose.model('Review', ReviewSchema);
