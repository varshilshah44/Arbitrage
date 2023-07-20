import express from "express";
import { AuthController } from "../controller/auth.controller";
import { OrderController } from "../controller/order.controller";

const router = express.Router();

router.post("/login", AuthController.userLogin);
router.post("/signup", AuthController.signup);

router.post("/updateOrderDetails", OrderController.updateOrderDetails);

router.use(
  AuthController.verifyJwtToken,
  AuthController.verifyUserAndAttachToRequest
);

router.post("/order", OrderController.createOrder);
router.get("/getHistories", OrderController.getHistories);

export default router;
