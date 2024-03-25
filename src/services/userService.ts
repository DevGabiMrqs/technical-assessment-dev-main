import { UserModel } from "../models";

export class UserService {
  async createUser(
    name: string,
    email: string,
    address: string,
    coordinates: [number, number],
  ): Promise<void> {
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
}
