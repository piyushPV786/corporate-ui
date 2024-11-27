import { Backdrop, CircularProgress } from '@mui/material'

interface LoadingBackdropProps {
  open: boolean
}

const LoadingBackdrop: React.FC<LoadingBackdropProps> = ({ open }) => (
  <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1000 }} open={open}>
    <CircularProgress color='primary' />
  </Backdrop>
)

export default LoadingBackdrop
