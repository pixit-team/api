import Models from "../Models";
import { User, UserDocument } from "../schemas/UserSchema";

export default class UserRepository {
  private readonly models: Models;

  constructor(models: Models) {
    this.models = models;
  }

  /**
   * Create a new User
   *
   * @param user  The User to create
   *
   * @return  The created User
   */
  public readonly create = async (user: User): Promise<UserDocument> => {
    return this.models.userModel.create(user);
  };

  /**
   * Find a specific User using its `email`
   *
   * @param email - The email of the User to look for
   *
   * @return  The corresponding User or `null`
   */
  public readonly findOneByEmail = async (
    email: string,
  ): Promise<User | null> => {
    return this.models.userModel.findOne({ email }).exec();
  };
}
