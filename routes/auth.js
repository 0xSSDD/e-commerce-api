const express = require('express');
const router = express.Router();

const { requireSignin, signup, signin, signout } = require('../controllers/auth');
const { userSignupValidator } = require('../validator/index');


router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;