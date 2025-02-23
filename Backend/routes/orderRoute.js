import express from "express";
import * as orderController from "../controllers/orderController.js"

const router = express.Router()
router.post('/orders/addOrder', orderController.postOrder)
router.post('/orders/addorderdtl', orderController.postOrderDtl)
router.get('/orders/getOrder', orderController.getOrder)
router.get('/orders/getOrderById/:id',orderController.getOrderById)
router.get('/orders/getOrderDtl/:id', orderController.getOrderDtl)
router.get('/orders/getProductDtl/:id',orderController.getProductDtl)
router.put('/orders/updateShipStatus',orderController.updateShipStatus)

export default router