import express from "express";
import * as memberController from "../controllers/memberController.js"

const router = express.Router()

router.get('/members/getss', memberController.getSession)
router.get('/members/logout', memberController.logoutMember)
router.get('/members/getMember/:id',memberController.getMembers)
router.post('/members', memberController.postMember)
router.post('/members/login', memberController.loginMember)
router.put('/members/update', memberController.updateMember)


export default router