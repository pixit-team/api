import EmailValidator from "./EmailValidator";
import NameValidator from "./NameValidator";
import PasswordValidator from "./PasswordValidator";

class Validators {
  public readonly emailValidator: EmailValidator;

  public readonly nameValidator: NameValidator;

  public readonly passwordValidator: PasswordValidator;

  constructor(
    emailValidator: EmailValidator,
    nameValidator: NameValidator,
    passwordValidator: PasswordValidator,
  ) {
    this.emailValidator = emailValidator;
    this.nameValidator = nameValidator;
    this.passwordValidator = passwordValidator;
  }
}

export default Validators;
