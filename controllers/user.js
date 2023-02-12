const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.get_all = async (req, res) => {
  try {
    let users = await User.find();
    // Only retrieve safe info
    let safeUsers = users.map(user => {
      return {
        id: user._id,
        name: user.first_name,
        lastname: user.last_name
      }
    });
    return res.status(200).json({
      safeUsers,
      message: 'Users Retrieved!'
    })
  } catch (error) {
    return res.status(500).json({
      message: `${error}`
    });
  }
}

exports.get_current_user = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      });
    }
    return res.status(200).json({
      user
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error 
    });
  }
}

exports.signup = async (req, res) => {
  try {
    const password = await bcrypt.hash(`${req.body.password}`, 10);
    const user = new User({
      password,
      email: req.body.email,
      first_name: req.body.name,
      last_name: req.body.lastname,
    });
    await user.save();
    return res.json({
      message: `Successfully created user ${user.first_name}`
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error signing up'
    });
  }
}

exports.login = async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    const match = await bcrypt.compare(`${req.body.password}`, user.password);
    if (!match) {
      return res.status(403).json({
        message: 'Wrong Password!'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `${error}`
    });
  }
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

  return res.status(200).json({
    token: 'Bearer ' + token,
    message: 'Logged in!',
  });
}

exports.friend_request = async (req, res) => {
  try {
    let sender = req.user;
    let reciever = await User.findById(req.body.id);
    if (!reciever) {
      return res.status(404).json({
        message: 'User not found!'
      });
    }
    if (sender.sent_reqs.includes(reciever._id)) {
      return res.json({
        message: 'Request already sent!'
      });
    }
    sender.sent_reqs.push(reciever);
    await sender.save();
    reciever.friend_reqs.push(sender);
    await reciever.save();
    return res.status(200).json({
      message: 'Friend request sent'
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error}`
    });
  }
}

exports.respond = async (req, res) => {
  try {
    const sender = req.user;
    const reciever = await User.findById(req.body.id);
    if (!sender.friend_reqs.includes(reciever._id)) {
      return res.json({
        message: 'response not avaliabe'
      });
    }
    sender.friends.push(reciever);
    reciever.friends.push(sender);
    await sender.save();
    await reciever.save();
    return res.json({
      message: 'Users are now friends'
    });
  } catch (error) {
    console.log(error)
    return res.json({
      message: `${error}`
    });
  }
}

exports.get_friends = async (req, res) => {
  try {
    const friends = await User.find({
      _id: { $in: req.user.friends }
    });
    return res.status(200).json(friends);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}