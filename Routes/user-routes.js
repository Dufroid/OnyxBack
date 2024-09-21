const Express = require("express");
const router = Express.Router();
require("dotenv").config();

const {
  handleSign,
  handleSignup,
  userLogin,
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
  notiLength
} = require("../Controllers/user-controller");
const { auth, setProfile } = require("../Middleware/auth");

router.post("/handleSign", handleSign);
router.post("/handleSignup", handleSignup)
router.post("/userLogin", userLogin);
router.put("/AddProfilePicture/:id", setProfile.single("UploadphotoInput"), AddProfilePicture);
router.put("/skip/:id", skip);
router.put("/userlanguage/:id", userlanguage)
router.post("/AddDrug/:id", AddDrug)
router.get("/gettingDrugs", gettingDrugs)
router.put("/addDescription/:id", addDescription)
router.get("/gettingDSingleDrug/:id",auth,gettingDSingleDrug)
router.post("/EditDrugName/:id", EditDrugName)
router.post("/EditDrugGramme/:id", EditDrugGramme)
router.post("/EditDrugQty/:id", EditDrugQty)
router.post("/EditDrugPrrice/:id", EditDrugPrrice)
router.delete("/DeleteDrug/:id", DeleteDrug)
router.post("/commandDrugs/:id", commandDrugs)
router.get("/getCommandAsNoti/:id",auth,getCommandAsNoti)
router.put("/goreadNoti/:userId/:id", goreadNoti)
router.put("/DeleteNoti/:userId/:id", DeleteNoti)
router.get("/getAllCommand", auth, getAllCommand)
router.put("/addDrug/:id", addDrug)
router.put("/cancelDrugCart/:id", cancelDrugCart)
router.put("/addDrugCart/:id", addDrugCart)
router.put("/removeDrugCart/:id", removeDrugCart)
router.put("/cancelSell", cancelSell)
router.post("/selling/:id", selling)
router.get("/soldProduct/:id",auth,soldProduct)
router.get("/dayDrugs", auth, dayDrugs)
router.get("/dayChart", auth, dayChart)
router.get("/notiLength/:id", auth, notiLength)


module.exports = router;