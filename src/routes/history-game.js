import express from "express"
import getGameHistory from "../controllers/"

const router = express.Router()

router.get("/:userId", auth,  getGameHistory)

export default router