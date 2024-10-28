import { useEffect, useState } from 'react'
import { IGroupTypes, IIntakeType, IProgramAPITypes } from 'src/context/types'
import { AcademicService, CommonService } from 'src/service'

const getHundredData = {
  q: '',
  pageSize: 100,
  pageNumber: 1
}
interface IIntake {
  name: string
}

const StudentManagementHook = () => {
  const [programLists, setProgramLists] = useState<IProgramAPITypes[]>([])
  const [intakeLists, setIntakeLists] = useState<IIntakeType[]>([])
  const [academicyear, setAcademicYear] = useState<Array<string>>([])
  const [groups, setGroups] = useState<IGroupTypes[]>([])

  const getCommonData = async () => {
    const programResponse = await AcademicService?.getAllProgramList()
    if (!!programResponse?.data?.data?.length) {
      setProgramLists(programResponse?.data?.data)
    }
    const intakeListResponse = await AcademicService?.getAllIntakeList()
    if (!!intakeListResponse?.data?.data) {
      setIntakeLists(intakeListResponse?.data?.data)
    }
    const groupResponse = await AcademicService?.getGroupList(getHundredData)
    setGroups(groupResponse?.data)
  }

  const getYearList = async () => {
    const yearResponse = await CommonService?.getYear()
    if (yearResponse?.data?.data?.length > 0) {
      setAcademicYear([...yearResponse?.data?.data].toString().split(','))
    }
  }

  const getIntakeLists = async (programCode: string) => {
    const intakeListResponse = await AcademicService?.getAllIntakeList(programCode)
    if (!!intakeListResponse?.data?.data) {
      return intakeListResponse?.data?.data
    }
  }

  const getIntakeListByGroup = async (groupCode: string) => {
    const intakeListResponse = await AcademicService?.getIntakeListByGroup(groupCode)
    if (!!intakeListResponse?.data?.data) {
      return intakeListResponse?.data?.data
    }
  }

  const filterIntakeName = (data: IIntake[]) => {
    const intake = data.map((item: IIntake) => item.name)

    return intake.join(',')
  }

  useEffect(() => {
    getCommonData()
    getYearList()
  }, [])

  return {
    getIntakeListByGroup,
    programLists,
    intakeLists,
    academicyear,
    groups,
    filterIntakeName,
    getIntakeLists
  }
}

export default StudentManagementHook
