import express from "express"
import * as messageController from "../controllers/message.controller.js"



const router = express.Router()

router.post("/", messageController.createMessage)
router.get("/:chatId",  messageController.getChatMessages)


export default router
