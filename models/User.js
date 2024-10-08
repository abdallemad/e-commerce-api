const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'please provide your name'],
  },
  email:{
    type:String,
    required:[true,'please provide email.'],
    unique:true,
    validate: {
      validator: validator.isEmail,  // Use the validator function here
      message: 'Please provide a valid email',  // Custom error message
    },
  },
  password:{
    type:String,
    required:[true,'please provide password'],
    minlength:8
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user',
    
  }
})

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword =async function(credentials){
  const isMatch =await bcryptjs.compare(credentials,this.password);
  return isMatch;
}

module.exports  = mongoose.model('User',UserSchema)