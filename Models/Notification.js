const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Notification = new Schema(
  {
    idProdui: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicament",
      },
    ],
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
    Vendeur: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Client: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Notifications = mongoose.model("Notification", Notification);

module.exports = Notifications;
