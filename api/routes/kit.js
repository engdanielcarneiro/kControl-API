const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Kit = require('../models/kit');
const { disconnect } = require('process');

//Get kits request
router.get('/', (req, res, next) => {
    Kit.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                kits: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nome: doc.nome,
                        descricao: doc.descricaoKit,
                        status: doc.status,
                        kitRequest: {
                            type: 'GET Kit por Nome',
                            url: 'http://localhost:3030/kits/' + doc.nome
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

router.get('/:nome', (req, res, next) => {
    const kitNome = req.params.nome;

    Kit.find({ nome: kitNome})
        .select('nome descricao _id  status')
        .exec()
        .then(doc => {
            if (doc){
                return res.status(200).json({
                    kit: doc,
                    request: {
                        type: 'GET',
                        description: "Veja todos os kits",
                        url: 'http://localhost:3030/kits/' 
                    }
                });
            } else {
                return res.status(404).json({
                    message: 'Nenhum kit encontrado com esse nome'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => { 
    const kit = new Kit({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        descricao: req.body.descricao,
        status: req.body.status,
    });
    kit
        .save()
        .then(result => {
            res.status(201).json({
                mensagem: 'Kit cadastrado com sucesso!',
                kitCriado: {
                    _id: result._id,
                    nome: result.nome,
                    descricao: result.descricao,
                    status: result.status,
                    kitRequest: {
                        type: 'GET Kit por Nome',
                        url: 'http://localhost:3030/kits/' + result.nome
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



module.exports = router;