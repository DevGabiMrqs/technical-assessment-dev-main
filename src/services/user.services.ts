import { UserModel } from "../models/user.models";
import { startSession } from "mongoose";

type UserData = {
  name: string;
  email: string;
  address: string;
  coordinates: [number, number];
};

type PaginationOptions = {
  page: number;
  pageSize: number;
};

export class UserService {
  async createUser({
    name,
    email,
    address,
    coordinates,
  }: UserData): Promise<void> {
    if ((address && coordinates) || (!address && !coordinates)) {
      throw new Error("Provide either address or coordinates, not both");
    }
    const user = new UserModel({
      name,
      email,
      address,
      coordinates,
    });
    await user.save();
  }

  async getUser(
    userData: UserData,
    paginationOptions: PaginationOptions,
  ): Promise<UserData[]> {
    const { page, pageSize } = paginationOptions;

    const query: any = {};
    if (userData.name) query.name = userData.name;
    if (userData.email) query.email = userData.email;
    if (userData.address) query.address = userData.address;
    if (userData.coordinates) query.coordinates = userData.coordinates;

    const users = await UserModel.find({ ...query })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return users;
  }

  async getUserById(userId: string): Promise<UserData | null> {
    return await UserModel.findById(userId);
  }

  async updateUser(
    userId: string,
    newData: UserData,
    session: any,
  ): Promise<UserData | null> {
    const user = await UserModel.findByIdAndUpdate(userId, newData, {
      new: true,
      session,
    });
    return user ? user.toObject() : null;
  }

  async deleteUser(userId: string): Promise<UserData | null> {
    return await UserModel.findByIdAndDelete(userId);
  }
}

export default new UserService();
