const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('hi from the server! this is a GET request!');
});

app.post('/', (req, res) => {
  res.status(200).send('this a POST request!');
});

const port = 3000;
app.listen(port, () => {
  console.log('im listening on port: ' + port);
});
