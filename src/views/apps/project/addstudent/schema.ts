import * as yup from 'yup'
import { AddStudentMessages } from 'src/context/common'

export const schema = yup.object().shape({
  firstName: yup
    .string()
    .required(AddStudentMessages.firstNameRequired)
    .matches(/^[a-zA-z]*$/, AddStudentMessages.firstNameError),

  lastName: yup
    .string()
    .required(AddStudentMessages.lastNameRequired)
    .matches(/^[a-zA-z]*$/, AddStudentMessages.lastNameError),
  email: yup.string().email().required(AddStudentMessages.emailRequired),
  dateOfBirth: yup.string().nullable().required(AddStudentMessages.birthRequired),
  gender: yup.string().required(AddStudentMessages.genderRequired),
  nationalityStatus: yup.string().required(AddStudentMessages.nationalityStatusRequired),
  nationality: yup.string().required(AddStudentMessages.nationalityRequired),
  identificationDocumentType: yup.string().required(AddStudentMessages.documentTypeRequired),
  passportExpiryDate: yup.string().when('identificationDocumentType', {
    is: 'PASPORT',
    then: yup.string().required(AddStudentMessages.expiryDateRequired),
    otherwise: yup.string().notRequired()
  }),
  identificationNumber: yup.string().required(AddStudentMessages.identificationNumberRequired).test('identificationDocumentType', AddStudentMessages.passportLengthError, (value)=>{
    const idLength = value?.length ?? 0
    
    return idLength >= 8 && idLength <= 13
  }),
  race: yup.string().required(AddStudentMessages.raceRequired),
  homeLanguage: yup.string().required(AddStudentMessages.homelanguageRequired),
  mobileNumber: yup.string().required(AddStudentMessages.contactRequired),
  postalAddress: yup.string().required(AddStudentMessages.postalAddressRequired),
  country: yup.string().required(AddStudentMessages.countryRequired),
  state: yup.string().required(AddStudentMessages.stateRequired),
  city: yup.string().required(AddStudentMessages.cityRequired),
  zipCode: yup
    .number()
    .positive()
    .required(AddStudentMessages.zipCodeRequired)
    .min(10000, AddStudentMessages.zipCodeMaxError)
    .max(999999, AddStudentMessages.zipCodeMaxError),
  highestQualification: yup.string().required(AddStudentMessages.higerQualificationRequired),
  highSchoolName: yup.string().required(AddStudentMessages.highSchoolNameRequired),
  isInternationalDegreeHolder: yup.string().required(AddStudentMessages.isInternationalDegreeHolderRequired)
})

export const draftSchema = schema.pick(['firstName', 'lastName', 'email', 'mobileNumber'])
