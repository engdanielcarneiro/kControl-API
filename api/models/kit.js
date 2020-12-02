const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  ocorrencia: { type: String, required: false, default: null },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Kit", productSchema);
