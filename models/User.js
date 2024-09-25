const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'please provide your name'],
  },
  email:{
    type:string,
    required:[true,'please provide email.'],
    unique:true
  }
})


module.exports  = mongoose.model('user',UserSchema)