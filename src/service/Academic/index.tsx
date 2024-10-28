import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { baseApiURL, apiEndPoints } from '../config'
import { DataParams, GraduationStudentParams } from '../Dashboard'

export default class Academic {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/academics/`
  financeBaseUrl = `${baseApiURL}/finance/`

  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async getFacilitator() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.facilitator
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching facilitator ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getProgramList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.program
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getAllProgramList(project?: boolean) {
    nProgress.start()
    let endUrlName = this.baseUrl + apiEndPoints.allPrograms

    if (project) endUrlName = `${endUrlName}?project=${project}`

    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching allPrograms detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getProgramByCode(code: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.program
    try {
      const response = await this.apiServer.get(`${endUrlName}/${code}`)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Qualification list by Id details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getProgramListByCode(code: number | string) {
    nProgress.start()
    const endUrlName = this.financeBaseUrl + apiEndPoints.studyModeByCode
    try {
      const response = await this.apiServer.get(`${endUrlName}/${code}`)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Qualification list by Id details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getGraduationRecords(payload: GraduationStudentParams) {
    nProgress.start()
    try {
      const response = await this.apiServer.get(
        `${this.baseUrl + apiEndPoints?.graduation}?programCode=${payload?.programCode}&academicYear=${
          payload.academicYear
        }`
      )

      return response?.data?.data?.data
    } catch (err: any) {
      console.log('Error fetching academic records ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getAllIntakeList(programCode?: string) {
    nProgress.start()
    let endUrlName = this.baseUrl + apiEndPoints.allIntake
    if (programCode) endUrlName = `${endUrlName}/${programCode}`
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching all Intake detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getIntakeListByGroup(groupCode?: string) {
    nProgress.start()
    let endUrlName = this.baseUrl + apiEndPoints.intakeByGroup
    if (groupCode) endUrlName = `${endUrlName}/${groupCode}`
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Intake list by group ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getIntakeProgramLists(programCode: string, studyModeCode: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.intakeUpcoming}/${programCode}/${studyModeCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching edit venue details ========>', err?.message)
    }
  }

  async getCoursesById(id: number | string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.programCourses}{programId}?programId=${id}`
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getIntakeLists(code: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.intakeLists}/${code}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error fetching edit venue details ========>', err?.message)
    }
  }

  async exemptCourses(params: any) {
    const endUrlName = this.baseUrl + apiEndPoints.exemptCourse
    try {
      const response = await this.apiServer.put(endUrlName, params)

      return response
    } catch (err: any) {
      console.log('Error fetching edit venue details ========>', err?.message)
    }
  }

  async getAllStudentDetailsById(studentCode: number | string, programCode: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.academicTranscriptStudentList
    try {
      const response = await this.apiServer.get(`${endUrlName}/${studentCode}/${programCode}`)

      return response
    } catch (err: any) {
      console.log('Error fetching All student Records details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getAllProgramName(programCode: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.programsCode
    try {
      const response = await this.apiServer.get(`${endUrlName}/${programCode}`)

      return response
    } catch (err: any) {
      console.log('Error fetching All program Name details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getProgram(programCode: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.programs
    try {
      const response = await this.apiServer.get(`${endUrlName}/${programCode}`)

      return response
    } catch (err: any) {
      console.log('Error fetching All program Name details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getProgramDuration(programCode: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.programs
    try {
      const response = await this.apiServer.get(`${endUrlName}/${programCode}`)

      return response?.data?.data?.minimumTimePeriod
    } catch (err: any) {
      console.log('Error fetching All program Name details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getStudentList(params: DataParams) {
    nProgress.start()

    let endUrlName = `${this.baseUrl + apiEndPoints.student}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`

    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getStudentIntakeList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studentIntake
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Intake List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getStudentIntakeListByIntakeId(id: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.student
    try {
      const response = await this.apiServer.get(`${endUrlName}/${id}`)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Intake List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getGroupList(params?: DataParams) {
    nProgress.start()

    let endUrlName = params
      ? `${this.baseUrl + apiEndPoints?.groups}?pageNumber=${params?.pageNumber}&pageSize=${params?.pageSize}`
      : this.baseUrl + apiEndPoints?.groups

    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching group list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getGroupListByYearCode(params?: DataParams) {
    nProgress.start()

    const endUrlName = params
      ? `${this.baseUrl + apiEndPoints?.groups}/${params?.academicYear}/${params?.code}`
      : this.baseUrl + apiEndPoints?.groups

    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.log('Error fetching group list by academic year and program code========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async validateGroupIntakeCourse(groupCode: string, intakeCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.validateCourseIntake}/${groupCode}/${intakeCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Intake List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async downloadTranscript(studentCode: string, programCode: string) {
    nProgress.start()
    let endUrlName = this.baseUrl + apiEndPoints.downloadAcademicTranscripts
    endUrlName = endUrlName.replace(':studentCode', studentCode)
    endUrlName = endUrlName.replace(':programCode', programCode)
    try {
      const response = await this.apiServer.get(`${endUrlName}`, {
        responseType: 'blob'
      })

      return response
    } catch (err: any) {
      console.log('Error in downloading academic transcript ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
}
