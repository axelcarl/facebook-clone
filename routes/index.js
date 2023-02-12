const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const passport = require('passport');

router.get('/', indexController.index);

router.get('/protected', passport.authenticate('jwt', {session: false}),
 indexController.protected);

module.exports = router;