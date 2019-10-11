export default class NameValidator {
  public readonly validate = (name: string): boolean => {
    return name.trim().length >= 1;
  };
}
