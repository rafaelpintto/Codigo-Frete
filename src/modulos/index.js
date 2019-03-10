'use strict'

const fc = require('./function') // functions
const express = require('express');
const app     = express();

app.get('/', function(req, res){
  res.send('<h2>Online<h2/>')
  //res.sendFile(path.join(__dirname+'/index.html'));
})

app.listen((process.env.PORT || 5002));
fc.debug('Clawler-FreteBras on port: ' + (process.env.PORT || 5002));
exports = module.exports = app;

