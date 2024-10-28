import toast from 'react-hot-toast'

let toasterLoading: string

export const successToast = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    style: {
      borderRadius: '10px',
      background: '#1f2b37',
      color: '#fff'
    },
    id: toasterLoading
  })
}

export const errorToast = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    style: {
      borderRadius: '10px',
      background: '#1f2b37',
      color: '#fff'
    },
    id: toasterLoading
  })
}

export const loadingToast = (message: string | undefined = 'Saving...') => {
  toasterLoading = toast.loading(message, {
    position: 'top-center',
    style: {
      borderRadius: '10px',
      background: '#1f2b37',
      color: '#fff'
    }
  })

  return toasterLoading
}

export const dismissLoadingToast = () => {
  toast.dismiss(toasterLoading)
}
