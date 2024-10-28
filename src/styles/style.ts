import { Box, Card, Grid, Typography, styled } from '@mui/material'

export const LightBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: 15,
  paddingBottom: 30,
  borderRadius: 10
}))
export const ProgramNameField = styled(Grid)(({ theme }) => ({
  borderRadius: '5px',
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.grey[400],
  width: '100%'
}))
export const TypographyEllipsis = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))
export const DarkGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white
}))
export const TableCard = styled(Card)(() => ({
  '& .digital-assessment': {
    backgroundColor: 'rgba(106, 118, 124, .1)'
  },
  '& .final-digital-assessment': {
    backgroundColor: 'rgba(106, 118, 124, .1)'
  },
  '& .assignments': {
    backgroundColor: 'rgba(42, 107, 100, .1)'
  },
  '& .examination': {
    backgroundColor: 'rgba(91, 70, 78, .1)'
  },
  '& .total': {
    backgroundColor: 'rgba(75, 183, 74, .1)'
  }
}))
