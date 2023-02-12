const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/',
  passport.authenticate('jwt', { session: false }),
  userController.get_all);

router.get('/current',
  passport.authenticate('jwt', { session: false }),
  userController.get_current_user);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/req',
  passport.authenticate('jwt', { session: false }),
  userController.friend_request);

router.post('/respond',
  passport.authenticate('jwt', { session: false }),
  userController.respond);

router.get('/friends',
  passport.authenticate('jwt', { session: false }),
  userController.get_friends);



module.exports = router;