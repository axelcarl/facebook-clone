const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const passport = require('passport');
const cors = require('cors');
require('./config/mongodb');
require('./config/passport');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(cors({
  origin: 'http://localhost:3000',
}));


// Routing
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);


// Run server
app.listen(process.env.PORT, () => console.log('server running'));

