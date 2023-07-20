import UserModal from "../models/userModel";

export class UserRepository {
  static createUser = async (data: object, fields = "") => {
    const newUser = await UserModal.create(data);
    return newUser;
  };

  static getUserById = async (id: string) => {
    let user: any = await UserModal.findById(id);

    return user;
  };

  static getUserByEmail = async (email: string) => {
    const user = await UserModal.findOne({ email }).select("+password");

    return user;
  };
}
