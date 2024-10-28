import React from 'react'

interface RequiredLabelProps {
  label: string
}

const RequiredLabel = ({ label }: RequiredLabelProps) => (
  <span>
    {label} <span style={{ color: 'red' }}>*</span>
  </span>
)

export default RequiredLabel
