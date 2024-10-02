const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Notification = new Schema(
  {
    Eleve: 
      {
        type: Schema.Types.ObjectId,
        ref: "Eleve",
      },
    
    isRead: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDelete: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    TypeNoti: {
      type: String,
    },
    Admn: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Payements: {
      type: Schema.Types.ObjectId,
      ref: "Payement",
    },
  },

  { timestamps: true }
);

const Notifications = mongoose.model("Notification", Notification);

module.exports = Notifications;
