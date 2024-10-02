const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Comment = new Schema(
  {
    Text: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    Communique: {
      type: Schema.Types.ObjectId,
      ref: "Communique",
    },

    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Comments = mongoose.model("Comment", Comment);

module.exports = Comments;
