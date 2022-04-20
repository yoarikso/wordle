'use strict';

// base setup
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// use static
app.use(express.static('src'));

// Routing 
app.get('/wordle/', (req, res) => {
  let indexPage = path.join(__dirname, '/src/view/index.html');
  res.sendFile(indexPage);
  //console.log("start: index.html called");
});

// start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});