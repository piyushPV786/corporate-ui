import React from 'react'
import { IconButton } from '@mui/material'
import { Star } from 'mdi-material-ui'

interface props {
  VIPType?: string
}

const VipTag = ({ VIPType }: props) => {
  return (
    <>
      <IconButton size='small' color='warning' className='vip-tag'>
        {VIPType === 'VIP' ? (
          <Star />
        ) : VIPType === 'VVIP' ? (
          <>
            <Star />
            <Star />
          </>
        ) : (
          <>
            <Star />
            <Star />
            <Star />
          </>
        )}
      </IconButton>
    </>
  )
}

export default VipTag
