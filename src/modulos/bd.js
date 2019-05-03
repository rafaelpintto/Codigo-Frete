const mongoose = require('mongoose');
const Frete = require('../models/Frete');
require('dotenv').load();

// BDCONFIG= URL
 
mongoose.connect(
  process.env.BDCONFIG,
  {
    useNewUrlParser: true,
  },
);

module.exports = {
    Insertdb: async function(json) {
        await Frete.create(json);
    },
    Checkdb: async function(url) {
        return await Frete.countDocuments({ url }) > 0;
    },
}