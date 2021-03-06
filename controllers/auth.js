const expressJwt = require('express-jwt'); // for authorization check
const jwt = require('jsonwebtoken'); // to generate signed token
const User = require('../models/user');
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.isAuth  = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!user) {
    return res.status(403).json({
      error: "Access denied."
    });
  }
  next();
};

exports.isAdmin  = (req, res, next) => {
  if(req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource. Access denied."
    });
  }
  next();
};

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
        error: "User with that Email does not exist, please signup" 
      });
    }

    // if user is found make sure the email and password match
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
  const user = new User(req.body);

  user.save( (err, user)=> {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    // since we dont need to show these two params - ugly
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    });

  });

});