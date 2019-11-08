import { ApiContext } from "../server/contexts/ApiContext";
import Repositories from "../models/repositories";
import Services from "../services";
import Validators from "../validators";

export default class AuthLocalController {
  private readonly repositories: Repositories;

  private readonly services: Services;

  private readonly validators: Validators;

  constructor(
    repositories: Repositories,
    services: Services,
    validators: Validators,
  ) {
    this.repositories = repositories;
    this.services = services;
    this.validators = validators;
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

    const cipheredPassword = await this.services.passwordService.cipherPassword(
      userPassword,
    );

    await this.repositories.userRepository.create({
      email: userEmail,
      name: userName,
      cipheredPassword,
    });

    ctx.status = 201;
    ctx.body = {
      message: ctx.t("req.user.created"),
    };
  };

  public readonly login = async (ctx: ApiContext): Promise<void> => {
    // Retrieve request body
    const userEmail: string =
      ctx.request.body.email ||
      ctx.throw(400, ctx.t("req.user.field.email.missing"));
    const userPassword: string =
      ctx.request.body.password ||
      ctx.throw(400, ctx.t("req.user.field.password.missing"));

    // Make sure email exists
    const correspondingUser = await this.repositories.userRepository.findOneByEmail(
      userEmail,
    );
    if (!correspondingUser) {
      ctx.throw(404, ctx.t("req.user.field.email.noMatch"));
      return;
    }

    // Match the given password and the hash
    const match = await this.services.passwordService.validatePassword(
      correspondingUser.cipheredPassword,
      userPassword,
    );
    if (!match) {
      ctx.throw(401, ctx.t("req.auth.failed"));
      return;
    }

    // Create a new access token
    const token = this.services.jwtService.tokenize({
      id: correspondingUser._id,
    });

    ctx.status = 200;
    ctx.body = {
      message: ctx.t("req.auth.local.loggedIn"),
      name: correspondingUser.name,
      token,
    };
  };
}
