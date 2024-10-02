const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Communique = new Schema(
  {
    Titre: {
      type: String,
    },
    Text: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    Comment: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }],

    Adm: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Communiques = mongoose.model("Communique", Communique);

module.exports = Communiques;
