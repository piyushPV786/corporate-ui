import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { getStateList } from 'src/utils'

interface IAddressState {
  name: string
  code: string
  countryCode: string
  latitude: string
  longitude: string
}
const EditSponsorDialogCustomHook = (countryCode: string, setLoading: Dispatch<SetStateAction<boolean>>) => {
  const [statesList, setStatesList] = useState<IAddressState[] | []>([])

  const fetchStatesList = async (countryCode: string) => {
    setLoading(true)
    if (countryCode) {
      const fetchedStates = await getStateList(countryCode)
      const FormattedData = fetchedStates.map((region: any) => {
        region['code'] = region['isoCode']
        delete region['isoCode']

        return region
      })
      setStatesList(FormattedData)
    } else {
      setStatesList([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStatesList(countryCode)
  }, [countryCode])

  return {
    statesList
  }
}

export default EditSponsorDialogCustomHook
