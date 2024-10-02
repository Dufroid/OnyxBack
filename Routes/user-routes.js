const Express = require("express");
const router = Express.Router();
require("dotenv").config();

const {
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
  commentaire
} = require("../Controllers/user-controller");
const { auth } = require("../Middleware/auth");

router.post("/handleSignup", handleSignup)
router.put("/completeSignup", completeSignup)
router.post("/userLogin", userLogin);
router.post("/AddingAdm", AddingAdm)
router.post("/AddPupil/:id", AddPupil)
router.get("/pupils", pupils)
router.get("/searcPupil/:id", searcPupil)
router.get("/specifPupils/:id/:adm", auth, specifPupils)
router.post("/payingForMonth/:id", payingForMonth)
router.get("/getNoti/:id", auth, getNoti)
router.put("/deletingNoti/:id", deletingNoti)
router.put("/goreadNoti/:userId/:id", goreadNoti)
router.get("/notiLength/:id", auth, notiLength)
router.get("/gettingPupil/:id", gettingPupil)
router.get("/gettingUnPidPupil/:id", gettingUnPidPupil)
router.get("/classPaid/:value", auth, classPaid)
router.get("/classUnPaid/:value", auth, classUnPaid)
router.post("/PostComminique/:id", PostComminique)
router.get("/SourirePommunique", SourirePommunique)
router.put("/deleting/:id", deleting)
router.post("/HendleComment/:id", HendleComment)
router.get("/commentaire/:id", auth, commentaire)



module.exports = router;