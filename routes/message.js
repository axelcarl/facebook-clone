const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message');
const passport = require('passport');

router.get('/',
  passport.authenticate('jwt', { session: false }),
  messageController.get_friends
);

router.get('/profile',
  passport.authenticate('jwt', { session: false }),
  messageController.get_profile
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  messageController.post
);


module.exports = router;