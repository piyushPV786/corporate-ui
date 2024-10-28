// ** React Imports
import { Fragment } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface FooterIllustrationsProp {
  image?: string
}

// Styled Components

const ShapeImg = styled('img')(({ theme }) => ({
  left: '15%',
  bottom: '15%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '7%'
  }
}))
const FooterIllustrations = (props: FooterIllustrationsProp) => {
  // ** Props
  const { image } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const src = image || `${process.env.NEXT_PUBLIC_BASE_URL}/images/pages/misc-coming-soon-object.png`
  if (!hidden) {
    return (
      <Fragment>
        <ShapeImg alt='shape' src={src} />
      </Fragment>
    )
  } else {
    return null
  }
}
export default FooterIllustrations
