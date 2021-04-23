const expressJwt = require('express-jwt'); // for authorization check
const jwt = require('jsonwebtoken'); // to generate signed token
const User = require('../models/user');
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], 
  userProperty: "auth",
});

exports.signin = ( (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => { 
    if(err || !user){
      return res.status(400).json({
        error: "User with that Email does not exist, please signup  q" 
      });
    }

    // if user is found make sure the email and password match
    // create a authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
          error: "Email and password dont match"
      });
    }

    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);

    // persist the token as t in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });

    //return response to user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({token, user: { _id, email, name, role } });

  }); 

});

exports.signout =( (req, res) => {
  // for signout all we have to do is clear cookie
  res.clearCookie('t');
  res.json({message: "Signed out user"});
});

exports.signup = ( (req, res) => {
  console.log('req body', req.body);
  const user = new User(req.body);

  user.save( (err, user)=> {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    // since we dont need to show this
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    });

  });

});