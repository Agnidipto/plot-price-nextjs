'use client';
import { ReactNode } from "react";
import { PriceProvider } from "./PriceContext";
import { LocationProvider } from "./LocationContext";

function Providers({children} : {children : ReactNode}) {
  return <PriceProvider>
    <LocationProvider>
      {children}
    </LocationProvider>
  </PriceProvider>
}

export default Providers