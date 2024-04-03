class Validator {
  static isValidName(input: string): boolean {
    if (input.length > 0 && input.trim() !== "") {
      return true;
    }
    return false;
  }
}
export default Validator;
