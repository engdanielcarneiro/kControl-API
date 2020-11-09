const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idAluno: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    idKit: {type: [mongoose.Schema.Types.ObjectId], ref: 'Kit', required: true}, 
    descricao: {type: String},
    ocorrencia: {type: String},
    dtEmprestimo: {type: Date, default: Date.now, required: true}, 
    dtFinalizacaoEmprestimo: {type: Date, default: null},
    status: {type: String, required: true},
    codigoMonitorEmprestimo: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    codigoMonitorFinalizacao: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
});

module.exports = mongoose.model('Emprestimo', productSchema);
