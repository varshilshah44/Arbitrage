import joi, { ObjectSchema, ValidationResult } from "joi";

interface joiValidationReturnType {
  status: boolean;
  error?: string;
}

const validateData = (
  schema: ObjectSchema,
  data: object
): joiValidationReturnType => {
  const validate: ValidationResult = schema.validate(data);
  if (validate.error) {
    return {
      status: false,
      error: validate.error?.details[0]?.message.replace(/"/g, ""),
    };
  } else {
    return {
      status: true,
    };
  }
};

export const signUpValidation = (data: object): joiValidationReturnType => {
  const schema: ObjectSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });
  return validateData(schema, data);
};
