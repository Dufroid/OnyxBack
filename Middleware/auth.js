const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const User = require("../Models/User-model");
const Profilepicture = require("../Models/ProfilePicture-model");
const Medicament = require("../Models/Medicament-model")

const url = process.env.URI;

// creating the storage engine for the profile picture user
const storage = new GridFsStorage({
  url,
  file: async(req, file) => {
    const filename = file.originalname;
    const userId = req.params.id;


    const ProfilePic = new Profilepicture({
      User: userId,
      FileName: filename,
    });
    const findUser = await User.findById(userId);
    const profileId = ProfilePic._id.toString();
    if (findUser) {
      await ProfilePic.save();
      await findUser.updateOne({ $set: { ProfilePicture: ProfilePic._id } });
      return {
        filename: filename,
        bucketName: "ProfilePicture",
        metadata: profileId,
      };
    }
  },
});

const setProfile = multer({ storage: storage });

// // creating the storage engine posting video streams
// const videoStorage = new GridFsStorage({
//   url,
//   file: async (req, file) => {
//     const filename = file.originalname;
//     const userId = req.params.id;
//     const { Description } = req.body;

//     const Medic = new Medicament({
//       Description: Description,
//       User: userId,
//     });
//     const findUser = await User.findById(userId);
//     const MedicId = Medic._id.toString();
//     if (findUser) {
//       await Medic.save();
//       await findUser.updateOne({ $push: { Medicament: Medic._id } });
//       return {
//         filename: filename,
//         bucketName: "qrCode",
//         metadata: MedicId,
//       };
//     }
//   },
// });

// const setVideoStream = multer({ storage: videoStorage });

// // middleware for authentificating the user through the token
const auth = (req, res, next) => {
  const token = req.header("x-access-token");
  try {
    if (!token) {
      return res.status(406).json({ err: "authorization denied" });
    } else {
      const verified = jwt.verify(token, process.env.TOKEN);
      if (!verified) {
        return res.json({ err: "token verification failed" });
      } else {
        next();
      }
    }
  } catch (error) {
    res.json({ error: "there was an error" });
  }
};

module.exports = {
  auth,
  setProfile,
//   setVideoStream,
};
