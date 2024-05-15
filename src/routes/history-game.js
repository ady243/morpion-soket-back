import express from "express"
import {getGameHistory} from "../controllers/getHistorySchema.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router()

router.get("/:userId",auth,  getGameHistory)

export default router