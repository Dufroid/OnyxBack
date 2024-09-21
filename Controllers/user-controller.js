const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Login = require("../Models/Login-model");
const User = require("../Models/User-model");
const Medicament = require("../Models/Medicament-model");
const Commende = require("../Models/Commende");
const Notification = require("../Models/Notification");
const Ventes = require("../Models/Ventes");
const Dailychart = require("../Models/DalyChart-model");

//Checking mail
const handleSign = async (req, res) => {
  const { Mail } = req.body;

  try {
    const userfound = await Login.findOne({ PhoneMail: Mail });
    if (userfound) {
      res.json({ error: "exist" });
    } else {
      res.json("exist");
    }
  } catch (error) {}
};

// Signup user
const handleSignup = async (req, res) => {
  const { Nom, Postnom, Mail, Pass, Adress } = req.body;
  const hashedPassword = await bcrypt.hash(Pass, 10);
  try {
    const userfound = await Login.findOne({ PhoneMail: Mail });
    const user = new User({ Fname: Nom, Lname: Postnom });
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

//the User Login controllers
const userLogin = async (req, res, next) => {
  const { Mail, PassWord } = req.body;
  console.log(Mail);

  try {
    let found = await Login.findOne({ PhoneMail: Mail }).select([
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

//Add profile picture
const AddProfilePicture = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({ User: user });
    }
  } catch (error) {}
};

//Skip adding profile
const skip = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({ User: user });
    }
  } catch (error) {}
};

const userlanguage = async (req, res) => {
  const userId = req.params.id;
  const { lang } = req.body;

  // try {
  //   const user = await User.findById(userId)
  //   if (user) {
  res.json({ User: lang });
  //   }
  // } catch (error) {}
};

//Add drug
const AddDrug = async (req, res) => {
  const userId = req.params.id;
  const { Drug, MG, Price, Qty, DType, Desc } = req.body;
  const Med = new Medicament({
    Nom: Drug,
    mg: MG,
    pu: Price,
    quantite: Qty,
    type: DType,
    Description: Desc,
    Admin: userId,
  });
  try {
    const user = await User.findById(userId);

    if (user) {
      await Med.save();
      res.json("done");
    }
  } catch (error) {}
};

//Getting drug
const gettingDrugs = async (req, res) => {
  try {
    const med = await Medicament.find().sort({ updatedAt: -1 });
    if (med) {
      res.json(med);
    }
  } catch (error) {}
};
//Add user description
const addDescription = async (req, res) => {
  const userId = req.params.id;
  const { Desc } = req.body;

  try {
    const user = await User.findById(userId);
    if (user) {
      await user.updateOne({ $set: { Desc: Desc } });
      res.json("ok");
    }
  } catch (error) {}
};

//getting single drug
const gettingDSingleDrug = async (req, res) => {
  const { id } = req.params;
  try {
    const med = await Medicament.findById(id);
    med ? res.json({ med }) : res.json("not exist");
  } catch (error) {}
};

//Editing drug name
const EditDrugName = async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;

  try {
    const med = await Medicament.findById(id);
    if (med) {
      await med.updateOne({ $set: { Nom: Name } });
      res.json("done");
    }
  } catch (error) {}
};

//Editing drug gramme
const EditDrugGramme = async (req, res) => {
  const { id } = req.params;
  const { Mg } = req.body;

  try {
    const med = await Medicament.findById(id);
    if (med) {
      await med.updateOne({ $set: { mg: Mg } });
      res.json("done");
    }
  } catch (error) {}
};

//Editing drug quantity
const EditDrugQty = async (req, res) => {
  const { id } = req.params;
  const { Qty } = req.body;

  try {
    const med = await Medicament.findById(id);
    if (med) {
      await med.updateOne({ $set: { quantite: Qty } });
      res.json("done");
    }
  } catch (error) {}
};

//Editing drug price
const EditDrugPrrice = async (req, res) => {
  const { id } = req.params;
  const { Price } = req.body;

  try {
    const med = await Medicament.findById(id);
    if (med) {
      await med.updateOne({ $set: { pu: Price } });
      res.json("done");
    }
  } catch (error) {}
};

//deleting drug
const DeleteDrug = async (req, res) => {
  const { id } = req.params;
  try {
    const med = await Medicament.findByIdAndDelete(id);
    med ? res.json("deleted successfully") : res.json("not deleted");
  } catch (error) {}
};

//Noti for commande
const CreateNoti = async (client, e) => {
  const noti = new Notification({
    idProdui: e,
    Client: client,
    TypeNoti: "Onyx",
  });
  await noti.save();
};
//Command drugs
const commandDrugs = async (req, res) => {
  const client = req.params.id;
  const { Data, PTG } = req.body;
  var idProd = [];
  const vante = Data.map(async (e) => {
    idProd.push(e.idProd);
  });
  const com = new Commende({
    idProdui: idProd,
    Client: client,
    PT: PTG,
    Com: Data,
  });
  if (vante) {
    await com.save();
    CreateNoti(client, idProd);
    res.json("done");
  }
};

//Getting user noti
const getCommandAsNoti = async (req, res) => {
  const userId = req.params.id;
  let tab = [];

  try {
    const FoundOnyx = await User.findById(userId);

    if (FoundOnyx.IsAdmin || FoundOnyx.IsSeller) {
      const typenoti = await Notification.find({
        TypeNoti: "Onyx",
        isDelete: { $ne: userId },
      })
        .populate("Client", ["Fname", "Lname", "ProfilePicture"])
        .populate("idProdui", ["Nom"]);
      const admnoti = await Notification.find({
        TypeNoti: "adm",
        isDelete: { $ne: userId },
      })
        .populate("Vendeur", ["Fname", "Lname", "ProfilePicture"])
        .populate("idProdui", ["Nom"]);

      const sellnoti = await Notification.find({
        TypeNoti: "sell",
        isDelete: { $ne: userId },
      })
        .populate("Vendeur", ["Fname", "Lname", "ProfilePicture"])
        .populate("idProdui", ["Nom"]);

      let notis = typenoti.concat(...admnoti, ...sellnoti);

      res.json({
        all: typenoti,
        adm: notis.sort((p1, p2) => {
          return new Date(p2?.createdAt) - new Date(p1?.createdAt);
        }),
      });
    }
  } catch (error) {}
};

//Read noti notification
const goreadNoti = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const noti = await Notification.findById(id);
    if (noti) {
      await noti.updateOne({ $push: { isRead: userId } });
      res.json({ do: "done" });
    } else {
      res.json("alwas read");
    }
  } catch (err) {}
};

//Delete noti notification
const DeleteNoti = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const noti = await Notification.findById(id);
    if (noti) {
      await noti.updateOne({ $push: { isDelete: userId } });
      res.json({ do: "done" });
    }
  } catch (err) {}
};

// Getting command
const getAllCommand = async (req, res) => {
  try {
    const command = await Commende.find()
      .populate("Client", ["Fname", "Lname", "ProfilePicture"])
      .populate("idProdui");
    if (command) {
      res.json(command);
    }
  } catch (error) {}
};

//Add drugs to art
const addDrug = async (req, res) => {
  const drug = req.params.id;
  const { num } = req.body;

  try {
    const med = await Medicament.updateOne(
      { _id: drug },
      { $inc: { quantite: -num } }
    );
    if (med) {
      res.json("done");
    }
  } catch (error) {}
};

//Cancel a drug
const cancelDrugCart = async (req, res) => {
  const drug = req.params.id;
  const { num } = req.body;

  try {
    const med = await Medicament.updateOne(
      { _id: drug },
      { $inc: { quantite: +num } }
    );
    if (med) {
      res.json("done");
    }
  } catch (error) {}
};

//Add a drug's quantity to the cart
const addDrugCart = async (req, res) => {
  const drug = req.params.id;
  const { num } = req.body;

  try {
    const med = await Medicament.updateOne(
      { _id: drug },
      { $inc: { quantite: -num } }
    );
    if (med) {
      res.json("done");
    }
  } catch (error) {}
};

//Remove a drug's quantity to the cart
const removeDrugCart = async (req, res) => {
  const drug = req.params.id;
  const { num } = req.body;

  try {
    const med = await Medicament.updateOne(
      { _id: drug },
      { $inc: { quantite: +1 } }
    );
    if (med) {
      res.json("done");
    }
  } catch (error) {}
};

//Cancel all drugs sellie,g operation
const cancelSell = async (req, res) => {
  const { Drug } = req.body;
  try {
    Drug.map(async (e) => {
      const All = await Medicament.updateOne(
        { _id: e._id },
        { $inc: { quantite: +e.Qty } }
      );
    });
    res.json("Done");
  } catch (error) {}
};

//Noti for commande
const CreateAdmNoti = async (venderId, e) => {
  const noti = new Notification({
    idProdui: e,
    Vendeur: venderId,
    TypeNoti: "sell",
  });
  await noti.save();
};

//Creating chart dayly chart
const daylychart = async (data) => {
  const date = new Date().getDate();

  data.map(async (e) => {
    const perDrug = await Dailychart.findOne({ idProduit: e._id, Day: date });
    if (perDrug) {
      await perDrug.update({ $set: { Qty: e.Qty + perDrug.Qty } });
    } else {
      const chart = new Dailychart({
        name: e.Nom,
        Qty: e.Qty,
        Day: date,
        idProduit: e._id,
      });
      await chart.save();
    }
  });
};

//Sell drug
const selling = async (req, res) => {
  const userId = req.params.id;
  const { data, PTG, qt } = req.body;
  const date = new Date().getDate();
  var idProd = [];
  try {
    daylychart(data);
    const ventelenght = await Ventes.find();

    const vante = data.map(async (e) => {
      idProd.push(e._id);
    });
    const ventes = new Ventes({
      FacNum: ventelenght.length + 1,
      idProduit: idProd,
      Vendeur: userId,
      PT: PTG,
      qt: qt,
      Vendus: data,
      perDay: date,
    });
    if (vante) {
      await ventes.save();
      CreateAdmNoti(userId, idProd);
      res.json(ventes._id);
    }
  } catch (error) {}
};

const soldProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const venteProd = await Ventes.findById(id).populate("Vendeur", [
      "Fname",
      "Lname",
    ]);
    if (venteProd) {
      res.json(venteProd);
    } else {
      res.json("vente not found");
    }
  } catch (error) {}
};

//Getting drugs of the days
const dayDrugs = async (req, res) => {
  const date = new Date().getDate();

  try {
    const drugs = await Ventes.find({ perDay: date });
    if (drugs) {
      res.json(drugs);
    }
  } catch (error) {}
};

//Getting the chart of the day
const dayChart = async (req, res) => {
  const date = new Date().getDate();

  try {
    const sell = await Dailychart.find({ Day: date });
    if (sell) {
      res.json(sell);
    }
  } catch (error) {}
};

//Getting noti length
const notiLength = async (req, res) => {
  const user = req.params.id;
  try {
    const noti = await Notification.find({
      isDelete: { $ne: user },
      isRead: { $ne: user },
    }).select(["Vendeur", "isDelete", "isRead"]);
    if (noti) {
      res.json(noti);
    }
  } catch (error) {}
};

module.exports = {
  handleSign,
  handleSignup,
  AddProfilePicture,
  skip,
  userlanguage,
  AddDrug,
  gettingDrugs,
  addDescription,
  gettingDSingleDrug,
  EditDrugName,
  EditDrugGramme,
  EditDrugQty,
  EditDrugPrrice,
  DeleteDrug,
  commandDrugs,
  getCommandAsNoti,
  goreadNoti,
  DeleteNoti,
  userLogin,
  getAllCommand,
  addDrug,
  cancelDrugCart,
  addDrugCart,
  removeDrugCart,
  cancelSell,
  selling,
  soldProduct,
  dayDrugs,
  dayChart,
  notiLength,
};
