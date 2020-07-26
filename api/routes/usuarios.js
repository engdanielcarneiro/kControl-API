const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
})

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(new Error('Extensão de arquivo inválida!'), false);
    }
}

const upload = multer({
    storage: storage,
    filefilter: filefilter
})

const Usuario = require('../models/usuario');
const {disconnect} = require('process');

router.get('/', (req, res, next) => {
    Usuario.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                usuarios: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nome: doc.nome,
                        codigo: doc.codigo,
                        senha: doc.senha,
                        curso: doc.curso,
                        cpf: doc.cpf,
                        dtNascimento: doc.dtNascimento,
                        btAdm: doc.btAdm,
                        foto: doc.foto,
                        codigoRequest: {
                            type: 'GET por Codigo',
                            url: 'http://localhost:3030/usuarios/codigo/' + doc.codigo
                        },
                        cpfRequest: {
                            type: 'Get por CPF',
                            url: 'http://localhost:3030/usuarios/cpf/' + doc.cpf
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
});

router.post('/', upload.single('foto'), (req, res, next) => {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        codigo: req.body.codigo,
        senha: req.body.senha,
        curso: req.body.curso,
        cpf: req.body.cpf,
        dtNascimento: req.body.dtNascimento,
        btAdm: req.body.btAdm,
        foto: req.file.path
    });
    usuario
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                mensagem: 'Usuário cadastrado com sucesso!',
                usuarioCriado: {
                    _id: result._id,
                    nome: result.nome,
                    codigo: result.codigo,
                    senha: result.senha,
                    curso: result.curso,
                    cpf: result.cpf,
                    dtNascimento: result.dtNascimento,
                    btAdm: result.btAdm,
                    foto: result.foto,
                    codigoRequest: {
                        type: 'GET por Codigo',
                        url: 'http://localhost:3030/usuarios/codigo/' + result.codigo
                    },
                    cpfRequest: {
                        type: 'Get por CPF',
                        url: 'http://localhost:3030/usuarios/cpf/' + result.cpf
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/codigo/:codigoUsuario', (req, res, next) => {
const codigo = req.params.codigoUsuario;
Usuario.find({codigo: codigo})
    .select('nome codigo senha curso cpf dtNascimento btAdm _id foto')
    .exec()
    .then(doc => {
        console.log("From database:", doc);
        if (doc) {
            return res.status(200).json({
                usuario: doc,
                request: {
                    type: 'GET',
                    description: "Veja todos os usuários:",
                    url: 'http://localhost:3030/usuarios/'
                }
            });
        } else {
            return res.status(404).json({
                message: 'Nenhum usuário encontrado com esse código.'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.get('/cpf/:cpf', (req, res, next) => {
    const cpf = req.params.cpf;
    Usuario.find({cpf: cpf})
        .select('nome codigo senha curso cpf dtNascimento btAdm _id')
        .exec()
        .then(doc => {
            console.log("From database:", doc);
            if (doc) {
                return res.status(200).json({
                    usuario: doc,
                    request: {
                        type: 'GET',
                        description: "Veja todos os usuários:",
                        url: 'http://localhost:3030/usuarios/'
                    }
                });
            } else {
                return res.status(404).json({
                    message: 'Nenhum usuário encontrado com esse cpf.'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
    });

router.patch('/:codigoUsuario', (req, res, next) => {
    const codigo = req.params.codigoUsuario;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Usuario
    .update({codigo: codigo}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Usuário atualizado!',
            request: {
                type: 'GET',
                url: 'http://localhost:3030/usuarios/codigo/' + codigo
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.delete('/:codigoUsuario', (req, res, next) => {
    const codigo = req.params.codigoUsuario;
    Usuario.remove({codigo: codigo})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Usuário deletado!',
            request: {
                type: "POST",
                url: 'http://localhost:3030/usuarios/',
                data: {
                    nome: 'String',
                    codigo: 'Number',
                    senha: 'String',
                    curso: 'String',
                    cpf: 'String',  
                    dtNascimento: 'String',
                    btAdm: 'Bool',
                    foto: "Arquivo png/jpeg"
                }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;