const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idAluno: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    nomeAluno: {type: String, default: null, required: true},   
    codigoMonitorEmprestimo: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    nomeMonitorEmprestimo: {type: String, default: null, required: true},   
    codigoMonitorFinalizacao: {type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Usuario'},
    nomeMonitorFinalizacao: {type: String, default: null},  
    idKits: {type: [mongoose.Schema.Types.ObjectId], ref: 'Kit', required: true}, //ver como declarar array e pegar de Kit  
    nomeKits: {type: [String], default: null, required: true},   
    descricao: {type: String, default: null},   
    ocorrencia: {type: String, default: null},
    dtEmprestimo: {type: Date, default: Date.now, required: true}, 
    dtFinalizacaoEmprestimo: {type: Date, default: null},
    status: {type: String, default: "Em aberto", required: true},
});

module.exports = mongoose.model('Emprestimo', productSchema);