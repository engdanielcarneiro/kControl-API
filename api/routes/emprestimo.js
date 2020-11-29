const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Emprestimo = require("../models/emprestimo");

//Consulta todos os Emprestimos
router.get("/", (req, res, next) => {
  Emprestimo.find()
    .exec()
    .then((docs) => {
      // sort by name
      docs.sort(function (a, b) {
        var statusA = a.status.toUpperCase(); // ignore upper and lowercase
        var statusB = b.status.toUpperCase(); // ignore upper and lowercase
        if (statusA < statusB) {
          return -1;
        }
        if (statusA > statusB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      const response = {
        count: docs.length,
        emprestimos: docs.map((doc) => {
          return {
            _id: doc._id,
            idAluno: doc.idAluno,
            nomeAluno: doc.nomeAluno,
            codigoAluno: doc.codigoAluno,
            codigoMonitorEmprestimo: doc.codigoMonitorEmprestimo,
            nomeMonitorEmprestimo: doc.nomeMonitorEmprestimo,
            codigoMonitorFinalizacao: doc.codigoMonitorFinalizacao,
            nomeMonitorFinalizacao: doc.nomeMonitorFinalizacao,
            idKits: doc.idKits,
            nomeKits: doc.nomeKits,
            status: doc.status,
            descricao: doc.descricao,
            ocorrencia: doc.ocorrencia,
            dtEmprestimo: doc.dtEmprestimo,
            dtFinalizacaoEmprestimo: doc.dtFinalizacaoEmprestimo,
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
    .exec()
    .then((doc) => {
      if (doc) {
        return res.status(200).json({
          emprestimo: doc,
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
router.post("/", (req, res, next) => {
  const emprestimo = new Emprestimo({
    _id: new mongoose.Types.ObjectId(),
    idAluno: req.body.idAluno,
    nomeAluno: req.body.nomeAluno,
    codigoAluno: req.body.codigoAluno,
    idKits: req.body.idKits,
    nomeKits: req.body.nomeKits,
    codigoMonitorEmprestimo: req.body.codigoMonitorEmprestimo,
    nomeMonitorEmprestimo: req.body.nomeMonitorEmprestimo,
  });
  emprestimo
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        mensagem: "Empréstimo cadastrado com sucesso!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//Update Emprestimo
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Emprestimo.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      req.app.io.emit("RefreshPage", true);
      res.status(200).json({
        message: "Emprestimo atualizado!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Emprestimo.remove({ _id: id })
    .exec()
    .then((result) => {
      req.app.io.emit("RefreshPage", true);
      res.status(200).json({
        message: "Emprestimo deletado!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Delete all emprestimos request
router.delete("/really/all", (req, res, next) => {
  Emprestimo.remove({})
    .exec()
    .then((result) => {
      req.app.io.emit("RefreshPage", true);
      res.status(200).json({
        message: "Todos os empréstimos apagados.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
