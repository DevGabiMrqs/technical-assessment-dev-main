import { UserModel } from "../models";

type User = {
  name: string;
  email: string;
  address: string;
  coordinates: [number, number];
};

export class UserService {
  async createUser({ name, email, address, coordinates }: User): Promise<void> {
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

  async getUser({}) {}
}

export default new UserService();
