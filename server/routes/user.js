const express = require("express")
const router = express.Router() ;

const imageUpload = require("../Config/imageUpload");
const {profile,editProfile,changePassword,addStoryToReadList,readListPage} = require("../Controllers/user");
const { getAccessToRoute } = require("../middlewares/auth");



router.get("/profile",getAccessToRoute ,profile)
router.post("/editProfile",[getAccessToRoute ,imageUpload.single("photo")],editProfile)
router.put("/changePassword",getAccessToRoute,changePassword)
router.post("/:slug/addStoryToReadList",getAccessToRoute ,addStoryToReadList)
router.get("/readList",getAccessToRoute ,readListPage)



module.exports = router