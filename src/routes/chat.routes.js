import express from "express"
import * as chatController from "../controllers/chat.controller.js"
import auth from "../middlewares/auth.middleware.js"


const router = express.Router()

router.post("/", chatController.createChat)
router.get("/:userId",  chatController.findUserChat)
router.post("/find/:firstId/:secondId", chatController.findChat)


export default router