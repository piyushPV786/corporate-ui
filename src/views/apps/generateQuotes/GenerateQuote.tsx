// ** React Imports

import Grid from '@mui/material/Grid'

import { Card } from '@mui/material'
import SearchHeader from 'src/pages/generate-quote/SearchHeader'

import GenerateQuotesAction from './GenerateQuotesAction'
import GenerateQuotesForm from './GenerateQuotesForm'
import React, { useState } from 'react'

const GenerateQuoteDialog = () => {
  const [formData, setFormData] = useState<any>(null)
  const [activityTimeline, setActivityTimeline] = useState<string | null>(null)
  const [submitForm, onFormSubmit] = useState<(() => void) | null>(null) // State to store form submit function
  const [resetForm, onFormReset] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [generateBtnEnable, setGenerateBtnEnable] = useState<boolean>(false)

  const handleActionClick = () => {
    if (submitForm) {
      submitForm()
    }
  }

  const handleFormData = (data: any) => {
    setFormData(data)
    if (data?.studentCode) {
      setActivityTimeline(data?.studentCode)
    }
  }

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={9}>
          <Card sx={{ mb: 4 }}>
            <SearchHeader
              onSubmit={handleFormData}
              value={'value'}
              onReset={onFormReset}
              setLoading={setLoading}
              setFormData={setFormData}
            />
          </Card>

          <GenerateQuotesForm
            submitForm={onFormSubmit}
            formData={formData}
            resetForm={resetForm}
            onReset={onFormReset}
            loading={loading}
            setLoading={setLoading}
            setGenerateBtnEnable={setGenerateBtnEnable}
          />
        </Grid>
        <Grid item xs={3}>
          <GenerateQuotesAction
            onSubmit={handleActionClick}
            activityTimeline={activityTimeline}
            setActivityTimeline={setActivityTimeline}
            resetForm={resetForm}
            generateBtnEnable={generateBtnEnable}
            formData={formData}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default GenerateQuoteDialog
