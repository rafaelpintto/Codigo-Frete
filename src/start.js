const http = require('http');

require('./modulos/main'); // check fretebras
require('./modulos/index'); // index

// don`t sleep heroku, get every 5 minutes (300000)
setInterval(() => { http.get('http://clawler-fretebras.herokuapp.com'); }, 300000);
