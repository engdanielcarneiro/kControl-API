const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Kit = require("../models/kit");

//Consulta todos os kits
router.get("/", (req, res, next) => {
  Kit.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        kits: docs.map((doc) => {
          return {
            _id: doc._id,
            nome: doc.nome,
            status: doc.status,
            descricao: doc.descricao,
            kitRequest: {
              type: "GET Kit por Nome",
              url: "http://localhost:3030/kits/" + doc.nome,
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

//Consulta kit pelo nome
router.get("/:nome", (req, res, next) => {
  const kitNome = req.params.nome;

  Kit.find({ nome: kitNome })
    .select("_id nome status descricao")
    .exec()
    .then((doc) => {
      if (doc) {
        return res.status(200).json({
          kit: doc,
          request: {
            type: "GET",
            description: "Veja todos os kits",
            url: "http://localhost:3030/kits/",
          },
        });
      } else {
        return res.status(404).json({
          message: "Nenhum kit encontrado com esse nome",
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

//Consulta kit pelo id
router.get("/id/:id", (req, res, next) => {
  const id = req.params.id;

  Kit.find({ _id: id })
    .select("_id nome status descricao")
    .exec()
    .then((doc) => {
      if (doc) {
        return res.status(200).json({
          kit: doc,
          request: {
            type: "GET",
            description: "Veja todos os kits",
            url: "http://localhost:3030/kits/",
          },
        });
      } else {
        return res.status(404).json({
          message: "Nenhum kit encontrado com esse id",
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

//Cria um kit
router.post("/", (req, res, next) => {
  const kit = new Kit({
    _id: new mongoose.Types.ObjectId(),
    nome: req.body.nome,
    descricao: req.body.descricao,
    status: req.body.status,
  });
  kit
    .save()
    .then((result) => {
      req.app.io.emit("RefreshPage", true);
      res.status(201).json({
        mensagem: "Kit cadastrado com sucesso!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Update kit request
// [{ "propName" : "value" }]
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Kit.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Kit atualizado!",
      });
      req.app.io.emit("RefreshPage", true);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Delete kit request
router.delete("/:_id", (req, res, next) => {
  const id = req.params._id;
  Kit.remove({ _id: id })
    .exec()
    .then((result) => {
      req.app.io.emit("RefreshPage", true);
      res.status(200).json({
        message: "Kit deletado!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Delete all kits request
router.delete("/really/all", (req, res, next) => {
  Kit.remove({})
    .exec()
    .then((result) => {
      req.app.io.emit("RefreshPage", true);
      res.status(200).json({
        message: "Todos os kits apagados.",
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
