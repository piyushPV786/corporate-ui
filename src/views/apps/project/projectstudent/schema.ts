import * as yup from 'yup'
import { AddStudentMessages, EditStudentMessages } from 'src/context/common'

const namePattern = /^(?! )[A-Z][a-z]*(?:-[A-Z][a-z]*)*(?:\s[A-Z][a-z]*(?:-[A-Z][a-z]*)*)*(?<! )$/

export const validationPersonalSchema = yup.object().shape({
  firstName: yup
    .string()
    .required(EditStudentMessages.firstNameRequired)
    .matches(namePattern, EditStudentMessages.firstNameError),
  middleName: yup
    .string()
    .nullable()
    .matches(namePattern, { message: EditStudentMessages.middleNameError, excludeEmptyString: true }),
  lastName: yup
    .string()
    .required(EditStudentMessages.lastNameRequired)
    .matches(namePattern, EditStudentMessages.lastNameError),
  gender: yup.string().required(AddStudentMessages.genderRequired),
  dateOfBirth: yup.string().required(AddStudentMessages.birthRequired),
  nationality: yup.string().required(AddStudentMessages.nationalityRequired),
  race: yup.string().required(AddStudentMessages.raceRequired),
  homeLanguage: yup.string().required(AddStudentMessages.homelanguageRequired),
  idType: yup.string().required('ID Type is required'),
  idNo: yup.string().required('ID Number is required')
})

export const validationContactSchema = yup.object().shape({
  email: yup.string().email().required(AddStudentMessages.emailRequired),
  contactNumber: yup.string().required(AddStudentMessages.contactRequired),
  whatsappNumber: yup.string().required(AddStudentMessages.whatappContactRequired)
})

export const validationAddressSchema = yup.object().shape({
  streetAddress: yup.string().required(AddStudentMessages.postalAddressRequired),
  country: yup.string().required(AddStudentMessages.countryRequired),
  state: yup.string().required(AddStudentMessages.stateRequired),
  city: yup.string().required(AddStudentMessages.cityRequired),
  zipCode: yup
    .number()
    .positive()
    .required(AddStudentMessages.zipCodeRequired)
    .min(10000, AddStudentMessages.zipCodeMaxError)
    .max(999999, AddStudentMessages.zipCodeMaxError)
})

export const validationQualificationSchema = yup.object().shape({
  highestQualification: yup.string().required(AddStudentMessages.higerQualificationRequired)
})
