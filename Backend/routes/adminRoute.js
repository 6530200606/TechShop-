import express from "express";
import * as adminController from "../controllers/adminController.js"

const router = express.Router()

router.get('/admins', adminController.getAllEmployee)
router.get('/admins/getss', adminController.getSession)
router.get('/admins/logout', adminController.logoutAdmin)
router.get('/admins/getAdmin/:id', adminController.getAdmin)
router.post('/admins', adminController.postAdmin)
router.post('/admins/login', adminController.loginAdmin)
router.put('/admins/update', adminController.updateAdmin)
router.delete('/admins/:id', adminController.delAdmins)


export default router