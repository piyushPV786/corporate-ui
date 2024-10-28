import React, { useEffect, useState } from 'react'
import { Grid, Typography, Button } from '@mui/material'
import { FinanceService } from 'src/service'
import { status } from 'src/context/common'
import { successToast } from '../Toast'

interface ResponseItem {
  url: string
  id: number
  account: string
  name: string
  title: string
  telephone: string
  email: string
  dcbalance: number
  paymentlink: string
  vouchercode: string
  company: string
}

const CommonDueAmount = ({ studentData }: any) => {
  const [response, setResponse] = useState<ResponseItem[]>([])

  const getDueAmountDetail = async (studentCode: string) => {
    const dueAmount = await FinanceService?.getDueAmountDetail(studentCode)
    if (dueAmount?.response) {
      setResponse(dueAmount?.response)
    }
  }
  useEffect(() => {
    if (studentData?.application?.lead?.studentCode) {
      getDueAmountDetail(studentData?.application?.lead?.studentCode)
    }
  }, [studentData])

  const handlePaymentLink = async () => {
    const payload = {
      name: `${studentData?.application?.lead?.firstName} ${studentData?.application?.lead?.lastName}`,
      emailId: `${studentData?.application?.lead?.email}`,
      url: `${response[0]?.paymentlink}`
    }
    const dueAmoutMail = await FinanceService?.sendDuePaymentMail(payload)
    if (dueAmoutMail?.statusCode == status?.successCodeOne) {
      successToast('Payment Link sent')
    }
  }

  return (
    <>
      <Grid container py={3} pr={4} columnSpacing={4} style={{ backgroundColor: '#1f2b37', borderRadius: '10px' }}>
        <Grid item>
          <Typography fontSize={10} color='white'>
            Due Balance
          </Typography>
          <Typography variant='body2' color={response[0]?.dcbalance > 0 ? '#f44336' : '#4caf50'}>
            <strong>{`R ${response[0]?.dcbalance ?? 0}`}</strong>
          </Typography>
        </Grid>
        <Grid item borderRight={theme => `1px solid ${theme.palette.grey[500]}`} />
        <Grid item display='flex' alignItems='center'>
          {response && response[0]?.dcbalance > 0 ? (
            <Button sx={{ mr: 2 }} variant='outlined' size='small' color='warning' onClick={() => handlePaymentLink()}>
              Send Payment Link
            </Button>
          ) : (
            <Button
              sx={{ mr: 2, bgcolor: '#e0e0e3', borderRadius: 0.5 }}
              variant='outlined'
              size='small'
              color='warning'
              disabled
            >
              Send Payment Link
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default CommonDueAmount
