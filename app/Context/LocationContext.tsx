import { ReactNode, createContext, useState } from "react"

type LocationState = {
  location : string,
  setLocation : (location: string) => void
}

const LocationContext = createContext<LocationState>({
  location : 'Rajarhat',
  setLocation : () => {}
})

export function LocationProvider({children} : {children : ReactNode}) {
  const [location, setLocation] = useState('Rajarhat')
  return <LocationContext.Provider value={{location, setLocation}}>
    {children}
  </LocationContext.Provider>
}

export default LocationContext
