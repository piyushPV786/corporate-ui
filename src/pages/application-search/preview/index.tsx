import { useRouter } from 'next/router'
import Preview from 'src/views/apps/applicationSearch/preview/Preview'

const InvoicePreview = () => {
  const router: any = useRouter()
  const id = router.query.id

  return <Preview id={id} />
}

export default InvoicePreview
