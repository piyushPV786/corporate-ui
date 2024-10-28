import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useForm, Controller } from 'react-hook-form'
import { userInformationStatus } from 'src/context/common'
import { Radio, FormControlLabel, RadioGroup, FormLabel, FormHelperText } from '@mui/material'
import { IAddVenueTypes } from 'src/types/apps/invoiceTypes'
import RequiredLabel from 'src/components/RequiredLabel'

const Transition = forwardRef((props: FadeProps & { children?: ReactElement }, ref: Ref<unknown>) => {
  return <Fade ref={ref} {...props} />
})

interface IEditVenueTypes {
  id: number
  accommodation?: boolean
  carHire?: boolean
  flights?: boolean
  venueCostIncluded?: boolean
  cateringInculded: boolean
}

interface IVenueLogisticsDialogProps {
  handleClickSuccess: () => void
  handleVenueEdit: () => void
  venueLogisticsDetails: (arg: IAddVenueTypes) => void
  data: IEditVenueTypes
}

const RadioGroupField = ({ name, control, label, required, errors }: any) => (
  <Box>
    <FormLabel sx={{ pl: 4 }}>{label}</FormLabel>
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value } }) => (
        <RadioGroup row value={value || 'no'} onChange={e => onChange(e.target.value)}>
          <FormControlLabel sx={{ pl: 4 }} value='yes' control={<Radio />} label='Yes' />
          <FormControlLabel sx={{ pl: 3 }} value='no' control={<Radio />} label='No' />
        </RadioGroup>
      )}
    />
    <FormHelperText error>{errors[name]?.message}</FormHelperText>
  </Box>
)

const VenueLogisticsDetail = ({
  handleClickSuccess,
  handleVenueEdit,
  venueLogisticsDetails,
  data
}: IVenueLogisticsDialogProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      accommodation: 'no',
      carHire: 'no',
      flights: 'no',
      venueCostIncluded: 'no',
      cateringInculded: 'no'
    }
  })

  const onSubmit = async (formData: any) => {
    const payload: IAddVenueTypes = {
      flights: formData.flights === 'yes',
      cateringInculded: formData.cateringInculded === 'yes',
      carHire: formData.carHire === 'yes',
      accommodation: formData.accommodation === 'yes',
      venueCostIncluded: formData.venueCostIncluded === 'yes'
    }

    venueLogisticsDetails(payload)
    setShow(false)
    data ? handleVenueEdit() : handleClickSuccess()
  }

  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      reset({
        accommodation: data?.accommodation ? 'yes' : 'no',
        carHire: data?.carHire ? 'yes' : 'no',
        flights: data?.flights ? 'yes' : 'no',
        venueCostIncluded: data?.venueCostIncluded ? 'yes' : 'no',
        cateringInculded: data?.cateringInculded ? 'yes' : 'no'
      })
    }
  }, [data])

  return (
    <Grid>
      <Box>
        <Button size='small' variant='contained' onClick={() => setShow(true)}>
          Add or Edit
        </Button>
      </Box>

      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Manage Venue Logistics
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={4} sx={{ pb: 3 }}>
                <RadioGroupField
                  name='accommodation'
                  control={control}
                  label={<RequiredLabel label='Accommodation' />}
                  required={userInformationStatus.AccommodationRequired}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={4}>
                <RadioGroupField
                  name='carHire'
                  control={control}
                  label={<RequiredLabel label='Car Hire' />}
                  required={userInformationStatus.CarHireRequired}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={4}>
                <RadioGroupField
                  name='flights'
                  control={control}
                  label={<RequiredLabel label='Flights' />}
                  required={userInformationStatus.FlightsRequired}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={4}>
                <RadioGroupField
                  name='venueCostIncluded'
                  control={control}
                  label={<RequiredLabel label='Venue Cost Included' />}
                  required={userInformationStatus.VenueCostIncludedRequired}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={4}>
                <RadioGroupField
                  name='cateringInculded'
                  control={control}
                  label={<RequiredLabel label='Catering Included' />}
                  required={userInformationStatus.CateringRequired}
                  errors={errors}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default VenueLogisticsDetail
