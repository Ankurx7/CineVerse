const express = require("express")
const router = express.Router() ;
const { getAccessToRoute } = require("../middlewares/auth");
const { addNewCommentToStory ,getAllCommentByStory,commentLike ,getCommentLikeStatus} = require("../Controllers/crudop")
const { checkStoryExist } = require("../middlewares/databaseErrorhandler");


router.post("/:slug/addComment",[getAccessToRoute,checkStoryExist] ,addNewCommentToStory)
router.get("/:slug/getAllComment",getAllCommentByStory)
router.post("/:comment_id/like",commentLike)
router.post("/:comment_id/getCommentLikeStatus",getCommentLikeStatus)


module.exports = router