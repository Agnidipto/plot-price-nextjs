'use client';

import { QueryClient, QueryClientProvider, queryOptions } from '@tanstack/react-query';
import React from 'react'

const ReactQueryClientProvider = ({children} : {children: React.ReactNode}) => {

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient} >
      {children}
    </QueryClientProvider>
  )
}

export default ReactQueryClientProvider