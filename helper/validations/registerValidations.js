import validator from 'validator';

export default function RegisterValidations(data) {
  const errors = {};

  if (validator.isEmpty(data.firstName?.trim()))
    errors.firstName = 'Please enter the first name.';
  if (validator.isEmpty(data.lastName?.trim()))
    errors.lastName = 'Please enter the last name.';
  if (validator.isEmpty(data.email?.trim()))
    errors.email = 'Please enter the email address.';
  if (!validator.isEmail(data.email))
    errors.email = 'Please enter a valid email address.';
  if (validator.isEmpty(data.dob?.trim()))
    errors.dob = 'Please enter your date of birth.';
  if (validator.isEmpty(data.permanentAddress?.trim()))
    errors.permanentAddress = 'Please enter your permanent address.';
  if (validator.isEmpty(data.companyName?.trim()))
    errors.companyName = 'Please enter your company name.';
  if (validator.isEmpty(data.companyAddress?.trim()))
    errors.companyAddress = 'Please enter your company address.';
  if (!validator.isEmpty(data.website) && !validator.isURL(data.website))
    errors.website = 'Please enter a valid URL.';
  if (
    !validator.isEmpty(data.currentSalary) &&
    !validator.isNumeric(data.currentSalary)
  )
    errors.currentSalary = 'Please enter a valid current salary.';
  if (
    !validator.isEmpty(data.targetSalary) &&
    !validator.isNumeric(data.targetSalary)
  )
    errors.targetSalary = 'Please enter a valid target salary.';

  return { errors, isValid: Object.keys(errors).length === 0 };
}
