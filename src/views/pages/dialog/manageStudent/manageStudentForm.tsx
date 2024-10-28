import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { Controller, useForm } from 'react-hook-form'
import { IGroupAPITypes, IGroupTypes, IIntakeType, IProgramAPITypes, studentRecords } from 'src/context/types'
import { useEffect, useState } from 'react'
import { ProgramNameField } from 'src/styles/style'
import { AcademicService, DashboardService } from 'src/service'
import { StudentManagement, intakeStatue, messages, status, userInformationStatus } from 'src/context/common'
import { errorToast, successToast } from 'src/components/Toast'
import StudentManagementHook from './customHook'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'

interface IStudentManagementProps {
  programLists: IProgramAPITypes[]

  years: Array<string>
  groups: IGroupTypes[]
  edit: boolean
  individualStudentData?: IGroupAPITypes
  onClickDialogue: () => void
  getStudentGroupList: () => void
}

const ManageStudentForm = ({
  programLists,
  years,
  groups,
  edit,
  individualStudentData,
  onClickDialogue,
  getStudentGroupList
}: IStudentManagementProps) => {
  const [excludeStudent, setExcludeStudent] = useState<studentRecords[]>([])

  const [checkValidation, setCheckValidation] = useState<boolean>(false)
  const [groupList, setGroupList] = useState<Array<IGroupTypes>>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [intakeLists, setIntakeLists] = useState<IIntakeType[]>([])
  const [getAllStudentList, setAllStudentList] = useState<studentRecords[]>([])
  const [loader, setLoader] = useState<boolean>(false)

  const { getIntakeListByGroup } = StudentManagementHook()
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({})

  const selectIntake = watch('select__intake')

  const excludeCheckboxWatch = watch('exclude')
  const groupCodeWatch = watch('group__code')

  const getStudentList = async (params: any) => {
    setLoader(true)
    const response = await DashboardService.getStudentListbyintake(params)
    const students = response?.data?.data?.data?.filter(
      (item: any) => item?.application?.status !== intakeStatue?.progAdmitted
    )
    setAllStudentList(students)
    getAllStudentList && filterExcludeIncludeStudent(selectIntake, students)
    setLoader(false)
  }
  const getGroupListByYearNCode = async (academicYear: number, programCode: string) => {
    const response = await AcademicService.getGroupListByYearCode({ academicYear: academicYear, code: programCode })

    if (!!response?.data?.length) {
      setGroupList(response.data)
      setErrorMessage('')
    } else {
      setGroupList([])
      setErrorMessage('No Groups for this Academic year and Qualification name')
    }
  }

  const selectIntakeOnDelete = (value: string) => {
    const filterData = selectIntake?.filter((item: string) => item !== value)
    setValue('select__intake', filterData)
  }

  const selectExcludeIntakeOnDelete = (value: string) => {
    const filterData = watch('exclude__intake')?.filter((item: string) => item !== value)
    setValue('exclude__intake', filterData)
  }

  const intakeListFilterByID = (value: string) => {
    let result = '-'

    if (value && intakeLists) {
      const filterIntake = intakeLists?.find(item => item?.code === value)
      result = filterIntake?.name ? filterIntake?.name : '-'
    }

    return result
  }

  const studentIntakeListFilterByID = (value: string, DataArray: any[]) => {
    let result = '-'

    if (value && intakeLists) {
      const filterIntake = DataArray?.find(item => item?.id === parseInt(value))

      result = filterIntake
        ? `${filterIntake?.application?.lead?.firstName} ${filterIntake?.application?.lead?.lastName} - ${filterIntake?.application?.lead?.studentCode}`
        : '-'
    }

    return result
  }

  const filterExcludeIncludeStudent = async (selectIntake: string[], allStudent: any[]) => {
    const excludeStudentFilter = allStudent?.filter(item =>
      selectIntake?.some((element: string) => element === item?.intake?.code)
    )

    setExcludeStudent(excludeStudentFilter)
  }

  const setDefaultFormValue = () => {
    reset({
      academic__year: individualStudentData?.academicYear,
      program__name: individualStudentData?.program?.code,
      group__code: individualStudentData?.groupCode,
      intakeCode: individualStudentData?.intakeCode,
      select__intake: individualStudentData ? individualStudentData?.intake?.map(intake => intake?.code) : [],
      exclude__intake: !!individualStudentData?.excludeStudent ? individualStudentData?.excludeStudent?.split(',') : [],
      include__intake: !!individualStudentData?.includeStudent ? individualStudentData?.includeStudent?.split(',') : [],
      include: individualStudentData?.includeStudent?.length ? true : false,
      exclude: individualStudentData?.excludeStudent?.length ? true : false,
      student: ''
    })
  }

  useEffect(() => {
    if (selectIntake) {
      checkIntakeAndGroup(selectIntake)
      selectIntake &&
        getStudentList({
          pageNumber: 1,
          pageSize: individualStudentData?.studentCount ? individualStudentData?.studentCount : 1000,
          q: '',
          intakeCode: individualStudentData ? individualStudentData?.intake?.map(intake => intake?.code) : selectIntake
        })
      filterExcludeIncludeStudent(selectIntake, getAllStudentList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectIntake])

  useEffect(() => {
    if (individualStudentData?.id && edit) {
      setDefaultFormValue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [individualStudentData])

  const getIntakes = async () => {
    const intake = await getIntakeListByGroup(watch('group__code'))
    setIntakeLists(intake)
  }

  useEffect(() => {
    watch('academic__year') && watch('program__name') && watch('group__code')
    getIntakes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('academic__year'), watch('program__name'), watch('group__code')])

  useEffect(() => {
    watch('academic__year') &&
      watch('program__name') &&
      getGroupListByYearNCode(watch('academic__year'), watch('program__name'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('academic__year'), watch('program__name')])

  const checkIntakeAndGroup = async (selectedIntakeValue: string[]) => {
    if (selectedIntakeValue) {
      const intakeDetails = selectedIntakeValue?.map(item => {
        return intakeLists?.find(element => element?.code === item)
      })

      const intakeCode = intakeDetails?.map(item => item?.code)?.toString()

      const groupDetails = groups?.find(item => item?.code === groupCodeWatch)

      if (groupDetails?.code && intakeCode) {
        const validateResponse = await AcademicService?.validateGroupIntakeCourse(groupDetails?.code, intakeCode)

        setCheckValidation(validateResponse)
        if (!validateResponse) {
          errorToast(messages?.intakeCourseValidationMessage)
        }
      }
    }
  }
  const onSubmit = async (data: any) => {
    reset({}, { keepValues: true })

    const final = excludeStudent.filter(element => {
      return !data.exclude__intake.some((item: any) => {
        return item == element.id
      })
    })

    const addPayload = {
      academicYear: data?.academic__year,
      programCode: data?.program__name,
      groupCode: data?.group__code,
      intakeCode: data?.select__intake?.toString(),
      student: final?.map(item => item?.id).toString(),

      excludeStudent: data.exclude__intake.toString()
    }

    const editPayload = {
      intakeCode: data?.select__intake?.toString(),
      student: final?.map(item => item?.id).toString(),

      // includeStudent: data.include__intake.toString(),
      excludeStudent: data.exclude__intake.toString()
    }

    let response
    if (edit) {
      response = await DashboardService?.updateStudent(
        editPayload,
        individualStudentData?.id ? individualStudentData?.id : 0
      )
    } else {
      response = await DashboardService?.addStudent(addPayload)
    }

    if (response?.message === StudentManagement.intakeAlreadyAssigned) {
      errorToast(response?.message)

      return
    } else if (response?.status === status.successCode || status.successCodeOne) {
      successToast(`${StudentManagement.Add}`)
      onClickDialogue()
      getStudentGroupList()
    } else {
      errorToast(StudentManagement.Error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loader}>
        <CircularProgress color='primary' />
      </Backdrop>
      {edit ? (
        <ProgramNameField container spacing={7} mb={8} ml={0} mt={8} pb={8}>
          <Grid item xs={2} display='grid' justifyContent='center'>
            <label>Academic Year</label>
            <Typography color={theme => theme.palette.common.white}>{individualStudentData?.academicYear}</Typography>
          </Grid>
          <Grid item xs={5} display='grid' justifyContent='center'>
            <label>Qualification Name & Study Mode</label>
            <Typography color={theme => theme.palette.common.white}>{individualStudentData?.program?.name}</Typography>
            <Typography color={theme => theme.palette.common.white}>
              ({individualStudentData?.program?.studyModeCodes})
            </Typography>
          </Grid>
          <Grid item xs={5} display='grid' justifyContent='center'>
            <label>Group Code & Name</label>
            <Typography color={theme => theme.palette.common.white}>{`${
              individualStudentData?.group?.code ? individualStudentData?.group?.code : '-'
            }/${individualStudentData?.group?.name ? individualStudentData?.group?.name : '-'}`}</Typography>
          </Grid>
        </ProgramNameField>
      ) : (
        <Grid container spacing={7} mb={8}>
          {years?.length > 0 && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.academic__year}>
                <Controller
                  name='academic__year'
                  defaultValue={new Date().getFullYear()}
                  control={control}
                  rules={{ required: userInformationStatus.academicYear }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={years}
                      onChange={(e, data) => field.onChange(data !== 0 ? data : '')}
                      renderInput={params => (
                        <TextField error={!!errors.academic__year} {...params} label='Academic Year' />
                      )}
                    />
                  )}
                />

                <FormHelperText error={!!errors.academic__year}>
                  {errors.academic__year && (errors.academic__year?.message as string | undefined)}
                </FormHelperText>
              </FormControl>
            </Grid>
          )}
          {programLists?.length > 0 && (
            <Grid item xs={12} md={8}>
              <FormControl fullWidth error={!!errors.program__name}>
                <ControlledAutocomplete
                  name='program__name'
                  control={control}
                  rules={{ required: userInformationStatus.program }}
                  options={programLists}
                  renderInput={params => (
                    <TextField {...params} error={!!errors.program__name} label='Qualification Name' />
                  )}
                />
                <FormHelperText error={!!errors.program__name}>
                  {errors.program__name && (errors.program__name?.message as string | undefined)}
                </FormHelperText>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            {groupList.length > 0 ? (
              <FormControl fullWidth error={!!errors.group__code}>
                <ControlledAutocomplete
                  name='group__code'
                  control={control}
                  options={groupList}
                  rules={{ required: userInformationStatus.groupName }}
                  renderInput={params => (
                    <TextField {...params} error={!!errors.group__code} label='Group Code & Name' />
                  )}
                />
                <FormHelperText error={!!errors.group__code}>
                  {errors.group__code && (errors.group__code?.message as string | undefined)}
                </FormHelperText>
              </FormControl>
            ) : (
              <Typography variant='body2' display='flex' justifyContent='center'>
                {errorMessage}
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
      <Grid container spacing={7}>
        <Grid item xs={12} md={12}>
          <Card sx={{ background: '#f7f7f7' }}>
            <CardHeader title='Intake Details' sx={{ textAlign: 'center' }} />
            <CardContent>
              <Grid container spacing={7}>
                {intakeLists?.length > 0 && (
                  <Grid item xs={6} md={6}>
                    <Controller
                      name='select__intake'
                      control={control}
                      rules={{ required: userInformationStatus.intake }}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.select__intake}>
                          <InputLabel id='select__intake'>Select Intake</InputLabel>
                          <Select
                            disabled={!edit && !groupCodeWatch}
                            multiple
                            labelId='select__intake'
                            label='Select Intake'
                            defaultValue={
                              individualStudentData ? individualStudentData?.intake?.map(intake => intake?.code) : []
                            }
                            {...field}
                            renderValue={(selected: string[]) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value: string) => (
                                  <CustomChip
                                    color='primary'
                                    skin='light'
                                    clickable
                                    key={value}
                                    label={intakeListFilterByID(value)}
                                    onMouseDown={(event: { stopPropagation: () => void }) => {
                                      event.stopPropagation()
                                    }}
                                    onDelete={e => {
                                      e.preventDefault()
                                      selectIntakeOnDelete(value)
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          >
                            {intakeLists
                              ?.sort((a, b) => a.name.localeCompare(b.name))
                              .map(item => (
                                <MenuItem key={`select__intake__${item?.id}`} value={item?.code}>
                                  {item.name}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText error={!!errors.select__intake}>
                            {errors.select__intake && (errors?.select__intake?.message as string | undefined)}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={3} md={3}>
                  <Controller
                    name='exclude'
                    control={control}
                    render={({ field }) => (
                      <FormControl component='fieldset' variant='standard'>
                        <FormControlLabel
                          {...field}
                          control={
                            <Checkbox checked={String(excludeCheckboxWatch)?.toLowerCase() === 'true'} name='exclude' />
                          }
                          label='Exclude Students'
                        />
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={6} md={6}>
                  <Controller
                    name='exclude__intake'
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id='exclude__intake'>Exclude Student (From Selected Intakes)</InputLabel>
                        <Select
                          disabled={!excludeCheckboxWatch}
                          multiple
                          labelId='exclude__intake'
                          label='Exclude Student (From Selected Intakes)'
                          {...field}
                          renderValue={(selected: string[]) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value: string) => (
                                <CustomChip
                                  color='error'
                                  skin='light'
                                  clickable
                                  key={`exclude__intake__${value}`}
                                  label={studentIntakeListFilterByID(value, excludeStudent)}
                                  onMouseDown={(event: { stopPropagation: () => void }) => {
                                    event.stopPropagation()
                                  }}
                                  onDelete={e => {
                                    e.preventDefault()
                                    selectExcludeIntakeOnDelete(value)
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {excludeStudent?.length ? (
                            excludeStudent?.map(item => (
                              <MenuItem key={`exclude__student__${item?.id}`} value={item?.id}>
                                {`${item?.application?.lead?.firstName} ${item?.application?.lead?.lastName} - ${item?.application?.lead?.studentCode}`}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem>No Exclude Student</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid alignItems='center' justifyContent='center' display='flex' mt={10}>
        <Box mr={5}>
          <Button variant='outlined' color='secondary' onClick={onClickDialogue}>
            Cancel
          </Button>
        </Box>
        <Box>
          <Button
            disabled={checkValidation ? !checkValidation : !isDirty}
            variant='contained'
            sx={{ mr: 2 }}
            type='submit'
          >
            Save
          </Button>
        </Box>
      </Grid>
    </form>
  )
}

export default ManageStudentForm
