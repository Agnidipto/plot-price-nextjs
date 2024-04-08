import { createContext, useState } from "react"

type PriceState = {
  price : number,
  setPrice : (count : number) => void
}

const PriceContext = createContext<PriceState>({
  price : 100000,
  setPrice : () => {}
})

export function PriceProvider({children} : {children : React.ReactNode}) {
  const [price, setPrice] = useState(100000)
  return <PriceContext.Provider value={{price, setPrice}}>
    {children}
  </PriceContext.Provider>
}

export default PriceContext

