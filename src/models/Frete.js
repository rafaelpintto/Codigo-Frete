const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const AutoIncrement = require('mongoose-sequence')(mongoose);

const FreteSchema = new mongoose.Schema({
  _id: Number,
  url: String,
  cidadeorigem: String,
  cidadedestino: String,
  estadoorigem: String,
  estadodestino: String,
  km: String,
  preco: String,
  peso: String,
  veiculo: [{type: String}],
  carroceria: [{type: String}],
  site: String
}, { _id: false, timestamps: { createdAt: 'created_at' } });

FreteSchema.plugin(AutoIncrement);
module.exports = mongoose.model('Frete', FreteSchema);
