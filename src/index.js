// index.js

// Import necessary modules
const blessed = require('blessed');

// Create a screen object
let screen = blessed.screen({
  smartCSR: true
});

// Create a box to display a message
let box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Installation complete!\nThank you for using express-essentials!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Append the box to our screen
screen.append(box);

// Handle resizing of the screen
screen.on('resize', function () {
  box.width = screen.width / 2;
  box.height = screen.height / 2;
  screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen
screen.render();
