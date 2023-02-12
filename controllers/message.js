const User = require('../models/user');
const Message = require('../models/message');
const user = require('../models/user');

exports.get_friends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'friends',
      populate: {
        path: 'messages',
      }
    });
    const messages = [];
    user.friends.forEach(friend => messages.push(...friend.messages));
    return res.status(200).json({
      messages,
      message: 'Success'
    });
  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }
}

exports.get_profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('messages');
    const messages = await user.messages;
    return res.status(200).json({
      messages,
      message: 'Success'
    });
  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }
}

exports.post = async (req, res) => {
  try {
    const fullname = `${req.user.first_name[0].toUpperCase()}${req.user.first_name.slice(1)} ${req.user.last_name[0].toUpperCase()}${req.user.last_name.slice(1)}`;
    const message = new Message({
      message: req.body.message,
      user: fullname,
      date: new Date()
    });
    await message.save();

    const user = await User.findById(req.user._id);
    user.messages.push(message._id);
    await user.save();

    return res.status(200).json({
      message: 'Message created!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
      error
    });
  }
}