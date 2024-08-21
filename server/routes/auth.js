const express = require("express")
const router = express.Router() ;

const {signup,login,forgotpassword,resetpassword,getPrivateData} = require("../Controllers/auth");
const { getAccessToRoute } = require("../middlewares/auth");


router.post("/register",signup)
router.post("/login",login)
router.post("/forgotpassword",forgotpassword)
router.put("/resetpassword",resetpassword)
router.get("/private",getAccessToRoute,getPrivateData)

module.exports = router