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
//middle wares
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
// const authenticateUser = require('./middleware/authentication');
// routes
const authRoute = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes')

// static middle ware
app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors());

// routes
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users', userRouter)
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