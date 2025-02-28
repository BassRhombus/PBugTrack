const fs = require('fs');

// Read the bugs.txt file
fs.readFile('bugs.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split the text by newlines and filter out empty lines
  const bugEntries = data.split('\n').filter(line => line.trim() !== '');
  
  // Convert each line to a JSON object
  const bugsJson = bugEntries.map(entry => {
    const fields = entry.split('\t');
    return {
      name: fields[0],
      location: fields[1],
      igTime: fields[2],
      timeOfDay: fields[3]
    };
  });

  // Write the JSON to a new file
  fs.writeFile('bugs.json', JSON.stringify(bugsJson, null, 2), err => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return;
    }
    console.log('Successfully converted bugs.txt to bugs.json');
  });
});