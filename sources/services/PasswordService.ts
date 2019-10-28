import Bcrypt from "bcryptjs";

/**
 * Simple utility allowing to cipher and match passwords
 */
export default class PasswordService {
  private static readonly NB_ROUNDS: number = 10;

  /**
   * Cipher the given password
   *
   * @param password  The password to cipher
   *
   * @return The ciphered password
   */
  public readonly cipherPassword = async (
    password: string,
  ): Promise<string> => {
    return Bcrypt.hash(password, PasswordService.NB_ROUNDS);
  };

  /**
   * Check if the given password corresponds to the ciphered one
   *
   * @param cipheredPassword  The ciphered hash to match against
   * @param password  The password to validate
   *
   * @return `true` if the password is compatible with this hash, `false` otherwise
   */
  public readonly validatePassword = async (
    cipheredPassword: string,
    password: string,
  ): Promise<boolean> => {
    return Bcrypt.compare(password, cipheredPassword);
  };
}
