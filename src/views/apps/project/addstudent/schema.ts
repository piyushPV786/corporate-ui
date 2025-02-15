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
  identificationNumber: yup
    .string()
    .required(AddStudentMessages.identificationNumberRequired)
    .test('identificationDocumentType', AddStudentMessages.identificationNumberLengthError, value => {
      const idLength = value?.length ?? 0

      return idLength >= 8 && idLength <= 13
    }),
  race: yup.string().required(AddStudentMessages.raceRequired),
  homeLanguage: yup.string().required(AddStudentMessages.homelanguageRequired),
  mobileNumberCountryCode: yup.string().required(AddStudentMessages.contactRequired),
  mobileNumber: yup
    .string()
    .required(AddStudentMessages.contactRequired)
    .when('mobileNumberCountryCode', {
      is: (mobileCountryCode: string) => mobileCountryCode !== '',
      then: yup
        .string()
        .test('mobileNumber-validation', AddStudentMessages.contactMinError, (value: any, context: any) => {
          const { mobileNumberCountryCode } = context.parent
          const mobileNumberWithoutCode = value?.replace(mobileNumberCountryCode || '', '') || ''

          return mobileNumberWithoutCode.length >= 6
        }),
      otherwise: yup.string().required(AddStudentMessages.contactRequired)
    }),
  postalAddress: yup.string().required(AddStudentMessages.postalAddressRequired),
  country: yup.string().required(AddStudentMessages.countryRequired),
  state: yup.string().required(AddStudentMessages.stateRequired),
  city: yup.string().required(AddStudentMessages.cityRequired),
  zipCode: yup
    .number()
    .positive()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required(AddStudentMessages.zipCodeRequired)
    .min(1000, AddStudentMessages.zipCodeMaxError)
    .max(999999, AddStudentMessages.zipCodeMaxError),
  highestQualification: yup.string().required(AddStudentMessages.higerQualificationRequired),
  isInternationalDegreeHolder: yup.string().required(AddStudentMessages.isInternationalDegreeHolderRequired)
})

export const draftSchema = schema.pick(['firstName', 'lastName', 'email', 'mobileNumber'])
