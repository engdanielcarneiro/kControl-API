const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Emprestimo = require("../models/emprestimo");

//Consulta todos os Emprestimos
router.get("/", (req, res, next) => {
    Emprestimo.find()
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          emprestimos: docs.map((doc) => {
            return {
              _id: doc._id,
              idAluno: doc.idAluno,
              idKit: doc.idKit,
              descricao: doc.descricao,
              ocorrencia: doc.ocorrencia,
              dtEmprestimo: doc.dtEmprestimo,
              dtFinalizacaoEmprestimo: doc.dtFinalizacaoEmprestimo,
              status: doc.status,
              codigoMonitorEmprestimo: doc.codigoMonitorEmprestimo,
              codigoMonitorFinalizacao: doc.codigoMonitorFinalizacao,
              kitRequest: {
                type: "GET Kit por Nome",
                url: "http://localhost:3030/emprestimos/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
        });
    });
});

//Consulta um emprestimo
router.get("/:id", (req, res, next) => {
    const id = req.params.id;
  
    Emprestimo.find({ _id: id })
      .select("_id idAluno idKit descricao ocorrencia dtEmprestimo dtFinalizacaoEmprestimo status codigoMonitorEmprestimo codigoMonitorFinalizacao")
      .exec()
      .then((doc) => {
        if (doc) {
          return res.status(200).json({
            kit: doc,
            request: {
              type: "GET",
              description: "Veja todos os emprestimos",
              url: "http://localhost:3030/emprestimos/",
            },
          });
        } else {
          return res.status(404).json({
            message: "Nenhum emprestimo encontrado com esse id",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
    });
});

//Cria emprestimo
router.post('/', (req, res, next) => {
    const emprestimo = new Emprestimo({
        _id: new mongoose.Types.ObjectId(),
        idAluno: req.body.idAluno,
        idKit: req.body.idKit,
        status: req.body.status,
        codigoMonitorEmprestimo: req.body.codigoMonitorEmprestimo
    });
    emprestimo
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                mensagem: 'Usuário cadastrado com sucesso!',
                usuarioCriado: {
                    _id: result._id,
                    idAluno: result.idAluno,
                    idKit: result.idKit,
                    status: result.status,
                    codigoMonitorEmprestimo: result.codigoMonitorEmprestimo,
                    emprestimoRequest: {
                        type: 'GET por Id',
                        url: 'http://localhost:3030/emprestimo/' + result._id
                    },
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

//Update Emprestimo
router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Emprestimo
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Emprestimo atualizado!',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});


router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Emprestimo.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Emprestimo deletado!',
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