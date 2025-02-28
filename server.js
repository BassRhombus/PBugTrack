const express = require('express');
const app = express();
const port = 3001;

// Serve static files from the current directory
app.use(express.static('./'));

// Start the server
app.listen(port, () => {
  console.log(`Bug Tracker app running at http://localhost:${port}`);
});