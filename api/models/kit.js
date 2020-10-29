const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: {type: String, required: true},
    descricao: {type: String, required: true},
    status: {type: Boolean, default: 0},
});

module.exports = mongoose.model('Kit', productSchema);