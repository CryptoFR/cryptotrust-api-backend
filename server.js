// server.js
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();

const port = 13377;
app.listen(port, () => {
  console.log('Live API for CryptoFR @ localhost:' + port);
});
