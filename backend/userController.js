const User = require('./User'); // Import the User model

// Fetch user settings
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user gesture mappings
exports.updateUserGestureMappings = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { gestureMappings: req.body.gestureMappings },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
