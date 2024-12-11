import express from "express";
import * as typeController from "../controllers/typeController.js"

const router = express.Router()

router.get('/types', typeController.getAllType)

export default router