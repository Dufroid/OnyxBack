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
      default : false
    },
    IsSeller: {
      type: Boolean,
    },
    Adress: {
      type: String, 
    },
    Desc: {
      type: String, 
    },
    Medicament: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicament",
        default: [],
      },
    ],
    MyNoti: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
        default: [],
      },
    ],
    Sex: {
      type: String,
    },
    SelectedLang: {
      type: String,
      default: "French",
    },
    
    DrugSearched: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicament",
      },
    ],
    ProfilePicture: {
      type: Schema.Types.ObjectId,
      ref: "ProfilePicture",
    },
    Login: {
      type: Schema.Types.ObjectId,
      ref: "Login",
    },
  },

  { timestamps: true }
);

const Users = mongoose.model("User", User);

module.exports = Users;
