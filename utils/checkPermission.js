const CustomErrors = require('../errors');

const checkPermission = (requestUser, resourceUserId)=>{
  // console.log(requestUser,'\n', resourceUserId , '\n', typeof resourceUserId)
  if(requestUser.role === 'admin') return;
  if(requestUser.id === resourceUserId.toString()) return
  throw new CustomErrors.UnauthorizedError('Access Forbidden');
}

module.exports = checkPermission