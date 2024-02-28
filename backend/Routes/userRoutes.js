import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  deleteuser,
  getprofile
} from "../controller/userController.js";
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getprofile", getprofile);
router.delete("/delete", deleteuser);

export default router;