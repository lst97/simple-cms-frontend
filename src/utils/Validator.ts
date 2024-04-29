/* eslint-disable @typescript-eslint/no-explicit-any */
class Validator {
  static isValidName(input: string): boolean {
    if (input.length > 0 && input.trim() !== "") {
      return true;
    }
    return false;
  }
}

export class ApiValidator {
  // static validateApiResponse(data: any) {
  //   const validationResult = apiResponseSchema.validate(data, {
  //     abortEarly: false,
  //   }); // Validate all fields
  //   if (validationResult.error) {
  //     throw new Error(
  //       validationResult.error.details.map((d) => d.message).join("\n")
  //     );
  //   }
  //   return data; // Return the validated data if successful
  // }
}
export default Validator;
