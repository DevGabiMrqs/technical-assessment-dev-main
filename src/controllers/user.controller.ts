import { Request, Response } from "express";
import { UserModel } from "../models";
import UserService from "../services/userService";

const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  DEFAULT_ERROR: 418,
};

export async function createUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    const newUser = await UserService.createUser(userData);
    res.status(STATUS.CREATED).json(newUser); //continuar
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fecthing users", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function getUsersById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).json({ message: " Failed to update user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found to delete" });
    }
    res.sendStatus(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
}
