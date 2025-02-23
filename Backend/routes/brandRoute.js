import express from "express";
import * as brandController from "../controllers/brandController.js"

const router = express.Router()

router.get('/brands', brandController.getAllbrands)

export default router