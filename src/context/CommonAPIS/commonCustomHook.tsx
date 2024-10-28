import { useEffect, useState } from 'react'
import { AcademicService, CommonService } from 'src/service'

const Data = [
  'programList',
  'studentTypes',
  'socialMedia',
  'race',
  'language',
  'nationality',
  'nationalityStatus',
  'country',
  'identificationType',
  'documentTypeList',
  'studyModes',
  'qualificationList'
]
const CommonCustomHook = () => {
  const [masterCommonData, setMasterCommonData] = useState<any>({
    programList: [],
    studentTypes: [],
    socialMedia: [],
    race: [],
    language: [],
    nationality: [],
    nationalityStatus: [],
    country: [],
    identificationType: [],
    documentTypeList: [],
    studyModes: [],
    qualificationList: []
  })

  const updateMasterData = (key: string, data: Array<any>) => {
    setMasterCommonData((prev: any) => ({ ...prev, [key]: data }))
  }

  const getMasterData = async () => {
    const result = await Promise.all([
      AcademicService.getAllProgramList(),
      CommonService.getStudentType(),
      CommonService.getSocialMedia(),
      CommonService.getRace(),
      CommonService.getLanguage(),
      CommonService.getNationalityList(),
      CommonService.getNationalityStatus(),
      CommonService.getCountryLists(),
      CommonService.getIdentificationTypeList(),
      CommonService.getProjectDocumentTypeList('false'),
      CommonService.getStudyMode(),
      CommonService.getHighestQualification()
    ])

    Data?.map((item, index) =>
      item === 'documentTypeList'
        ? updateMasterData(item, result[index]?.data)
        : updateMasterData(item, result[index]?.data?.data)
    )
  }

  useEffect(() => {
    getMasterData()
  }, [])

  return { masterCommonData }
}
export default CommonCustomHook
