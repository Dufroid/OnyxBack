const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Eleve = new Schema(
  {
    Nom: {
      type: String,
    },
    Prenom: {
      type: String,
    },
    Postom: {
      type: String,
    },
    Classe: {
      type: String,
    },
    Ecole: {
      type: String,
    },
    Age: {
      type: Date,
    },
    Sex: {
      type: String,
    },
    Payements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payement",
      },
    ],
    Adm: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Eleves = mongoose.model("Eleve", Eleve);

module.exports = Eleves;
