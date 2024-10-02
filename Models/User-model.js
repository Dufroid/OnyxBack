const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema(
  {
    Fname: {
      type: String,
    },
    Lname: {
      type: String,
    },
    IsAdmin: {
      type: Boolean,
      default: false,
    },
    AnneeScolaire: [],
    MyNoti: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
        default: [],
      },
    ],
    pupilSearched: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicament",
      },
    ],
    Login: {
      type: Schema.Types.ObjectId,
      ref: "Login",
    },
  },

  { timestamps: true }
);

const Users = mongoose.model("User", User);

module.exports = Users;
