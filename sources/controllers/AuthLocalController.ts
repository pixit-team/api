import { ApiContext } from "../utils/ApiContext";
import Repositories from "../models/repositories";
import Validators from "../validators";
import Views from "../views";

export default class AuthLocalController {
  private readonly repositories: Repositories;

  private readonly validators: Validators;

  private readonly views: Views;

  constructor(
    repositories: Repositories,
    validators: Validators,
    views: Views,
  ) {
    this.repositories = repositories;
    this.validators = validators;
    this.views = views;
  }

  public readonly register = async (ctx: ApiContext): Promise<void> => {
    // Retrieve request body
    const userEmail: string =
      ctx.request.body.email ||
      ctx.throw(400, ctx.t("req.user.field.email.missing"));
    const userName: string =
      ctx.request.body.name ||
      ctx.throw(400, ctx.t("req.user.field.name.missing"));
    const userPassword: string =
      ctx.request.body.password ||
      ctx.throw(400, ctx.t("req.user.field.password.missing"));

    // Validate fields
    if (!this.validators.emailValidator.validate(userEmail)) {
      ctx.throw(400, ctx.t("req.user.field.email.invalid"));
    }
    if (!this.validators.nameValidator.validate(userName)) {
      ctx.throw(400, ctx.t("req.user.field.name.invalid"));
    }
    if (!this.validators.passwordValidator.validate(userPassword)) {
      ctx.throw(400, ctx.t("req.user.field.password.invalid"));
    }

    // Make sure email is available
    const alreadyExistingEmail = await this.repositories.userRepository.findOneByEmail(
      userEmail,
    );
    if (alreadyExistingEmail) {
      ctx.throw(409, ctx.t("req.user.field.email.alreadyExists"));
    }

    // TODO: Cipher password
    const cipheredPassword = userPassword;

    const createdUser = await this.repositories.userRepository.create({
      email: userEmail,
      name: userName,
      cipheredPassword,
    });

    ctx.body = {
      message: ctx.t("req.user.created"),
      user: this.views.userView.formatPrivateUser(createdUser),
    };
  };
}
