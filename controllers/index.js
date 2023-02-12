exports.index = (req, res) => {
  return res.json({
    message: 'welcome to facebook'
  });
}

exports.protected = (req, res) => {
  return res.json({
    user: req.user.first_name,
    message: `protected`
  });
}