const express = require('express');
const router = express.Router();
const { executeAction } = require('./commands'); // Change this to the correct file name

// POST route to handle gesture actions
router.post('/', (req, res) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'No action provided' });
  }

  // Execute the action using the executeAction function
  executeAction(action);

  // Send a response back to the client
  res.status(200).json({ message: `Action '${action}' executed.` });
});

module.exports = router;
