import { useState, useEffect } from 'react'
import { ApplyService } from 'src/service'
import { getStateList } from 'src/utils'

interface IAddressState {
  name: string
  code: string
  countryCode: string
  latitude: string
  longitude: string
}
const EditSponsorDialogCustomHook = (countryCode: string) => {
  const [statesList, setStatesList] = useState<IAddressState[] | []>([])
  const [masterData, setMasterData] = useState<any>([])
  const [loading, setLaoaing] = useState<boolean>(false)

  const getMasterData = async () => {
    const data = await ApplyService.getMasterData()
    setMasterData(data)
  }

  const fetchStatesList = async (countryCode: string) => {
    setLaoaing(true)

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
    setLaoaing(false)
  }

  useEffect(() => {
    fetchStatesList(countryCode)
    getMasterData()
  }, [countryCode])

  return {
    statesList,
    masterData,
    loading
  }
}

export default EditSponsorDialogCustomHook
