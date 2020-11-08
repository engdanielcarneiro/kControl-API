const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idAluno: {type: Number,required: true},
    idKit: {type: [String], required: true}, //ver como declarar array e pegar de Kit
    descricao: {type: String},
    ocorrencia: {type: String},
    dtEmprestimo: {type: Date, default: Date.now, required: true}, 
    dtFinalizacaoEmprestimo: {type: Date, default: null},
    status: {type: String, required: true},
    codigoMonitorEmprestimo: {type: Number, required: true},
    codigoMonitorFinalizacao: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
});

module.exports = mongoose.model('Emprestimo', productSchema);
