import express from "express";
const router = express.Router();
import {
    createtask, deletetask, edittask, gettask
  } from "../controller/taskController.js";
  router.post("/createtask", createtask);
  router.post("/gettask", gettask
  )
  router.route("/:id").patch(edittask).delete(deletetask);
export default router;
