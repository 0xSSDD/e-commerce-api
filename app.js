const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

// import routes
const userRoutes = require('./routes/user');

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



// routes middleware
app.use('/api', userRoutes);


const port  = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);

});