const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config()

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/user");

// app
const app = express();

// db
// To start mongodb - linux - sudo systemctl start mongod
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
})
.then(() => console.log('DB connected'))
.catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middleware
app.use('/api', authRoutes);
app.use("/api", userRoutes);


const port  = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);

});