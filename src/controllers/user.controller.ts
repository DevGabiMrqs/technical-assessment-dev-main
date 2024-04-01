import { Request, Response } from "express";
import UserService from "../services/user.services";
import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";

// const STATUS = {
//   OK: 200,
//   CREATED: 201,
//   UPDATED: 201,
//   NOT_FOUND: 404,
//   BAD_REQUEST: 400,
//   INTERNAL_SERVER_ERROR: 500,
//   DEFAULT_ERROR: 418,
// };

export async function createUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    const newUser = await UserService.createUser(userData);
    return res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const { page, pageSize } = req.query;
    const userData = req.body;
    const paginationOptions = {
      page: parseInt(page as string, 10) || 1,
      pageSize: parseInt(pageSize as string, 10) || 10,
    };
    const users = await UserService.getUser(userData, paginationOptions);
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.error("Error fecthing users", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch users" });
  }
}

export async function getUsersById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const session = await startSession();
    session.startTransaction();
    const updatedUser = await UserService.updateUser(id, updateData, session);
    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    await session.commitTransaction();
    session.endSession();
    return res.json(updatedUser);
  } catch (error) {
    console.log("Error updating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: " Failed to update user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedUser = await UserService.deleteUser(id);
    if (!deletedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found to delete" });
    }
    return res
      .sendStatus(StatusCodes.OK)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete user" });
  }
}
