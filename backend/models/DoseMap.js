const mongoose = require('mongoose');

const DoseMapSchema = new mongoose.Schema({
  userId: String,
  name: String,
  data: Object,
  imageBase64: String
});

module.exports = mongoose.model('DoseMap', DoseMapSchema);
