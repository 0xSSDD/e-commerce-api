const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

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



// routes
app.get('/', (req, res) => {
  res.send("helloworld - node");
});


const port  = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);

});