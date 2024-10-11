require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./db/connect')
//middle wares pages
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2
//middle wares
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
// const authenticateUser = require('./middleware/authentication');
// routes
const authRoute = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoute');
const reviewRouter = require('./routes/reviewRoute');
const orderRouter = require('./routes/orderRoute')

// static middle ware
app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors());
app.use(express.static('./public'))
app.use(fileUpload({
  
}))

cloudinary.config({
  api_key:process.env.CLOUDINARY_API_KEY,
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})
// routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders',orderRouter);

app.get('/api/v1',(req,res)=>{
  console.log(req.signedCookies.token);
  res.send('hello world');
})

// errors middle wares
app.use(notFound);
app.use(errorHandler);

const start = async ()=>{
  try {
    connectDB(process.env.MONGO_URI) 
    app.listen(port, ()=>{
      console.log(`server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log('killed');
  }
}
start();