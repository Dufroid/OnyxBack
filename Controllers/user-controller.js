const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Login = require("../Models/Login-model");
const User = require("../Models/User-model");
const Eleve = require("../Models/Eleve-model");
const Notification = require("../Models/Notification");
const Payement = require("../Models/Payement-model");
const Communique = require("../Models/Communique-model");
const Comment = require("../Models/Comment-model");

// Signup user
const handleSignup = async (req, res) => {
  const { Nom, Prenom, Mail, Pass, Annee } = req.body;
  const hashedPassword = await bcrypt.hash(Pass, 10);
  try {
    const userfound = await Login.findOne({ PhoneMail: Mail });
    const user = new User({ Fname: Nom, Lname: Prenom });
    const login = new Login({
      PassWord: hashedPassword,
      PhoneMail: Mail,
      User: user._id,
    });
    if (userfound) {
      res.json({ Error: "User with this email already exist" });
    } else {
      await user.save();
      await login.save();
      const token = jwt.sign(
        {
          UserId: user._id,
        },
        process.env.TOKEN
      );
      res.json({ userToken: token });
    }
  } catch (error) {}
};

//Complete signup
const completeSignup = async (req, res) => {
  const { First, Second, UserId } = req.body;
  try {
    const user = await User.findById(UserId);
    if (user) {
      await user.updateOne({ $set: { AnneeScolaire: [First, Second] } });
      res.json("done");
    }
  } catch (error) {}
};

//the User Login controllers
const userLogin = async (req, res) => {
  const { Mail, PassWord } = req.body;
  try {
    const found = await Login.findOne({ PhoneMail: Mail }).select([
      "PassWord",
      "PhoneMail",
      "User",
    ]);
    if (found) {
      const matched = await bcrypt.compare(PassWord, found.PassWord);
      if (matched) {
        const user = await User.findById(found.User);
        const token = jwt.sign(
          {
            UserId: user._id,
          },
          process.env.TOKEN
        );
        res.status(201).json({ UserToken: token, User: user });
      } else {
        res.json({ message: "the Token doesn't match " });
      }
    } else {
      res.json({ message: "user not found " });
    }
  } catch (err) {}
};

//Add admin
const AddingAdm = async (req, res) => {
  const { Mail } = req.body;

  const login = new Login({
    PhoneMail: Mail,
  });

  try {
    const found = await Login.findOne({ PhoneMail: Mail }).select([
      "PassWord",
      "PhoneMail",
      "User",
    ]);

    if (found) {
      res.json({ retry: "Mail exist" });
    } else {
      await login.save();
      res.json("done");
    }
  } catch (error) {}
};

// create Notification when paid money
const Notis = async (eleve, admn) => {
  try {
    const noti = new Notification({
      TypeNoti: "Ajout",
      Eleve: eleve,
      Admn: admn,
    });
    await noti.save();
  } catch (error) {}
};
// Add a pupil
const AddPupil = async (req, res) => {
  const { Nom, Prenom, Postnom, Class, Age, Sex, Ecole } = req.body;
  const user = req.params.id;
  const eleve = new Eleve({
    Nom: Nom,
    Prenom: Prenom,
    Postom: Postnom,
    Classe: Class,
    Age: Age,
    Sex: Sex,
    Adm: user,
    Ecole: Ecole,
  });

  try {
    const Adm = await User.findById(user);
    if (Adm.IsAdmin == true) {
      await eleve.save();
      Notis(eleve._id, user);
      res.json({ done: "done" });
    } else {
      res.json("Admin required");
    }
  } catch (error) {}
};

//Getting pupils
const pupils = async (req, res) => {
  try {
    const all = await Eleve.find();
    if (all) {
      res.json({ pupils: all });
    }
  } catch (error) {}
};

//Getting pupils
const specifPupils = async (req, res) => {
  const id = req.params.id;
  const adm = req.params.adm;
  try {
    const eleve = await Eleve.findById(id).populate("Payements");
    const userAdm = await User.findById(adm);
    if (eleve) {
      res.json({ pupils: eleve, Adm: userAdm });
    }
  } catch (error) {}
};

// create Notification when paid money
const Noti = async (eleve, admn, payement) => {
  try {
    const noti = new Notification({
      TypeNoti: "Payement",
      Eleve: eleve,
      Payements: payement,
      Admn: admn,
    });
    await noti.save();
  } catch (error) {}
};

//Payin for a month
const payingForMonth = async (req, res) => {
  const { Month, EleveId, MoisAct } = req.body;
  const UserId = req.params.id;

  try {
    const eleve = await Eleve.findById(EleveId);
    const adm = await User.findById(UserId);
    if (eleve) {
      const payement = new Payement({
        Mois: Month,
        Montat: 1,
        ActuelMois: MoisAct,
        Eleve: EleveId,
        Adm: UserId,
        AnneeSco: adm.AnneeScolaire,
      });
      Noti(EleveId, UserId, payement._id);
      await payement.save();
      await eleve.updateOne({ $push: { Payements: payement._id } });
      res.json("done");
    }
  } catch (error) {}
};

//Searching pupil
const searcPupil = async (req, res) => {
  const userId = req.params.id;
  const word = req.query.pupil;
  var tab = [];

  try {
    const Name = await Eleve.find({ Nom: { $regex: word, $options: "i" } });
    const Prenom = await Eleve.find({
      Prenom: { $regex: word, $options: "i" },
      _id: { $nin: Name },
    });
    // const Postnom = await Eleve.find({ Postom: { $regex: word, '$options' : 'i' } })

    if (Name || Prenom) {
      tab = Name.concat(...Prenom);
      res.json(tab);
    }
  } catch (er) {}
};

//Getting user noti
const getNoti = async (req, res) => {
  const userId = req.params.id;

  try {
    const admin = await User.findById(userId);

    if (admin.IsAdmin == true) {
      const noti = await Notification.find({
        isDelete: { $ne: userId },
      })
        .populate("Payements")
        .populate("Eleve")
        .populate("Admn");

      res.json({
        Notis: noti.sort((p1, p2) => {
          return new Date(p2?.createdAt) - new Date(p1?.createdAt);
        }),
      });
    }
  } catch (error) {}
};

//Delete noti notification
const deletingNoti = async (req, res) => {
  const userId = req.params.id;
  const { notiId } = req.body;

  try {
    const noti = await Notification.findById(notiId);
    if (noti) {
      await noti.updateOne({ $push: { isDelete: userId } });
      res.json({ do: "done" });
    }
  } catch (err) {}
};

//Read noti notification
const goreadNoti = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const noti = await Notification.findById(id);
    if (noti.isRead.includes(userId)) {
      res.json("always read");
    } else {
      await noti.updateOne({ $push: { isRead: userId } });
      res.json({ do: "done" });
    }
  } catch (err) {}
};

//Getting noti length
const notiLength = async (req, res) => {
  const user = req.params.id;
  try {
    const noti = await Notification.find({
      isDelete: { $ne: user },
      isRead: { $ne: user },
    }).select(["Eleve"]);
    if (noti) {
      res.json(noti);
    }
  } catch (error) {}
};

//Getting paid pupils list
const gettingPupil = async (req, res) => {
  const month = Number(req.params.id);
  try {
    const pupils = await Payement.find({ ActuelMois: month }).populate("Eleve");

    if (pupils) {
      res.json(pupils);
    }
  } catch (error) {}
};

//Getting unpaid pupils list
const gettingUnPidPupil = async (req, res) => {
  const month = Number(req.params.id);
  try {
    const pupils = await Payement.find({ ActuelMois: month });
    const paid = [];
    pupils.map((id) => paid.push(id.Eleve));

    if (pupils) {
      const unpaid = await Eleve.find({ _id: { $nin: paid } });
      res.json(unpaid);
    }
  } catch (error) {}
};

//Gettign pupils by their promotion
const classPaid = async (req, res) => {
  const classe = req.params.value;

  const mois = new Date().getMonth();

  try {
    const pupils = await Payement.find({ ActuelMois: mois + 1 });
    const paid = [];
    pupils.map((id) => paid.push(id.Eleve));

    const pupil = await Eleve.find({ Classe: classe, _id: { $in: paid } });
    if (pupil) {
      res.json({ pupils: pupil });
    }
  } catch (error) {}
};

//Gettign pupils by their promotion
const classUnPaid = async (req, res) => {
  const classe = req.params.value;

  const mois = new Date().getMonth();

  try {
    const pupils = await Payement.find({ ActuelMois: mois + 1 });
    const paid = [];
    pupils.map((id) => paid.push(id.Eleve));

    const pupil = await Eleve.find({ Classe: classe, _id: { $nin: paid } });
    if (pupil) {
      res.json({ pupils: pupil });
    }
  } catch (error) {}
};

//Creating post or commuique
const PostComminique = async (req, res) => {
  const userId = req.params.id;
  const { Title, Text } = req.body;

  const commuique = new Communique({
    Titre: Title,
    Text: Text,
    Adm: userId,
  });
  if (userId) {
    await commuique.save();
    res.json("done");
  }
};

//Getting post communique
const SourirePommunique = async (req, res) => {
  try {
    const post = await Communique.find({ isDelete: false }).populate("Adm");
    if (post) {
      res.json({ post: post });
    }
  } catch (error) {}
};

//Deleting communique @post
const deleting = async (req, res) => {
  const userId = req.params.id;
  const { post } = req.body;

  try {
    const commuique = await Communique.findById(post);
    if (commuique) {
      await commuique.updateOne({ $set: { isDelete: true } });
      res.json("done");
    }
  } catch (error) {}
};

//Commenting
const HendleComment = async (req, res) => {
  const { postId, text } = req.body;
  const user = req.params.id;

  const comment = new Comment({
    Text: text,
    Communique: postId,
    User: user,
  });

  try {
    const post = await Communique.findById(postId);
    if (post) {
      await comment.save();
      await post.updateOne({ $push: { Comment: comment._id } });
      res.json("done");
    }
  } catch (error) {}
};

//Getting comment
const commentaire = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.find({ Communique: id }).populate("User")
    if (comment) {
      res.json({ coms: comment });
    }
  } catch (error) {}
};

module.exports = {
  handleSignup,
  completeSignup,
  userLogin,
  AddingAdm,
  AddPupil,
  pupils,
  searcPupil,
  specifPupils,
  payingForMonth,
  getNoti,
  deletingNoti,
  goreadNoti,
  notiLength,
  gettingPupil,
  gettingUnPidPupil,
  classPaid,
  classUnPaid,
  PostComminique,
  SourirePommunique,
  deleting,
  HendleComment,
  commentaire,
};
