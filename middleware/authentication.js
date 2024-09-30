const {isTokenValid} = require('../utils')
const CustomErrors = require('../errors')
const authenticateUser = async (req,res,next)=>{
  const token = req.signedCookies?.token || ''
  if(!token) console.log('token is messing')
  else console.log('token is present');
  next();
}

module.exports = authenticateUser