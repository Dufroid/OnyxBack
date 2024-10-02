const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Payement = new Schema(
  {
    Mois: {
      type: String,
    },
    ActuelMois: {
        type: Number,
      },
    Montat: {
      type: Number,
    },
    Eleve:
      {
        type: Schema.Types.ObjectId,
        ref: "Eleve",
      },
      AnneeSco : [],
     Adm:
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
  },

  { timestamps: true }
);

const Payements = mongoose.model("Payement", Payement);

module.exports = Payements;
