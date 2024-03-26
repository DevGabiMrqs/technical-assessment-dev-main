import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUsersById,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUsersById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
