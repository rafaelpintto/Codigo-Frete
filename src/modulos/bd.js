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
    Deletedb: async function(url) {
        await Frete.deleteOne({ url });
    },
    Checkdb: async function(url) {
        return await Frete.countDocuments({ url }) > 0;
    },
    Listdb: async function(query, pages, perPage){
        return await Frete.find(query).skip(perPage * (pages-1)).limit(perPage)
    },
}