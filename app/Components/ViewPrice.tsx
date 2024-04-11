'use client';
import { useIsFetching, useIsMutating, useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import PriceContext from '../Context/PriceContext';
import LocationContext from '../Context/LocationContext';

type myData = {
  area? : number,
  boundary? : number,
  construction? : number,
  floor? : number,
  open_sides? : number,
  garden_park? : number,
  main_road? : number,
  pool? : number,
  width_road? : number,
  new_property? : number,
  location? : Array<string>
}

async function testPredictions() : Promise<any> {
  try {
    const model = await axios.get('https://plot-price-flask.onrender.com/')
    const res = await axios.get('https://plot-price-flask.onrender.com/test')
    // console.log(res.data)
    return res.data.price
  }
  catch(err : any) {
    if(err.response) {
      console.log('error occured in test:', err.response.data.exception)
      throw new Error(String(err.response.data.exception))
    }
    else {
      console.log('error occured in test:', err.message)
      throw new Error(String(err.message))
    }
  }
}

async function getPricePredictions(data : myData) : Promise<any> {
  try {
    const res = await axios.post('https://plot-price-flask.onrender.com/predict', data)
    // console.log('res', res)
    return res.data.price
  } catch(err : any) {
    if(err.response) {
      console.log('error occured in predict:', err.response.data.exception)
      throw new Error(String(err.response.data.exception))
    }
    else {
      console.log('error occured in predict:', err.message)
      throw new Error(String(err.message))
    }
  }
}

async function getLocations() : Promise<any> {
  try {
    const res = await axios.get('https://plot-price-flask.onrender.com/locations')
    return res.data
  }
  catch(err: any) {
    if(err.response) {
      console.log('error occured in location:', err.response.exception)
      throw new Error(String(err.response.data.exception))
    }
    else {
      console.log('error occured in location:', err.message)
      throw new Error(String(err.message))
    } 
  }
}

function ViewPrice() {

  const {price, setPrice} = useContext(PriceContext)
  const {location, setLocation} = useContext(LocationContext)
  const [error, setError] = useState<String|undefined>("");

  const {isFetching: priceLoading, 
    error:priceError, 
    data: testPrice, 
    refetch: refetchTest} = useQuery({
    queryKey: ['test'],
    queryFn: testPredictions,
    initialData: 100000,
  })

  useEffect(() => {
    setPrice(testPrice)
  }, [testPrice])

  const {isLoading: locationLoading, error: locationError, data: locations} = useQuery<Array<string>>({
    queryKey: ['locations'],
    queryFn : getLocations,
    initialData : [],
  })

  useEffect(() => {
    if(priceError)
    setError(priceError?.message)
    else if(locationError)
    setError(locationError?.message)
    else
    setError(undefined)
  }, [priceError, locationError])

  const priceMutate = useMutation({
  mutationKey : ['predict'],
  mutationFn : getPricePredictions,
  onSuccess: (data) => {
    setPrice(data);
  },
  onError: (error) => {
    setError(error.message)
  },
  });

  const isFetching = Boolean(useIsFetching({queryKey : ['test']}))
  const isMutating = Boolean(useIsMutating({mutationKey : ['predict']}))

  const [data, setData] = useState<myData>({})

  function handleChange(e: any) {
    setData(prevState => 
      ({...prevState, [e.target.id] : Number(e.target.value)}))
  }

  function handleLocationSelect(e : any) {
    if(e.target.value != '') {
    setLocation(e.target.value)
    setData(prev => ({...prev, ['location'] : [e.target.value]}))
    }
    else {
      const newData = {...data}
      delete newData['location']
      setData(newData)
    }
  }

  function handleCheckbox(e:any) {
    setData(prev => ({...prev, [e.target.id] : Number(e.target.checked)}))
  }

  function handleSubmit(e: any) {
    e.preventDefault()
    priceMutate.mutate(data)
  }

  return (<>
  <div className='w-full xl:w-10/12 md:w-7/12 py-5 grow text-center flex justify-center items-center'>
    {(isFetching || isMutating) && 
    <div role="status">
      <svg aria-hidden="true" className="mt-8 inline w-8 h-full text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>}
    {!(isFetching || isMutating) && !error && 
    <div>
      <h1 className='text-2xl block xl:hidden mb-8'>Kolkata Plot Price</h1>
      <h1 className='text-2xl hidden xl:block mb-8'>Price</h1>
      <h1 className='text-5xl mt-8'>
        ₹ {(Number(price)/100000).toFixed(2)} Lacs!
      </h1>
    </div>}
    {!(isFetching || isMutating) && error && 
    <div>
      <h1 className='text-lg'>Error</h1>
      <h1 className='text-3xl mt-8'>{error}</h1>
    </div>}
  </div>
  <div className='w-full xl:w-10/12 md:w-7/12 mb-5 flex flex-col items-center'>
    <div className='grid grid-cols-2 gap-4 w-full'>
      <div className="mb-2">
        <label htmlFor="area" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Area (sq. ft.)</label>
        <input 
        type="number" id="area" 
        onChange={handleChange}
        className="placeholder-gray-500 bg-gray-950 border border-gray-300 text-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
        placeholder="1440" 
        required />
      </div>
      <div className='mb-2'>
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
        <select id="location" 
        onChange={handleLocationSelect}
        className="bg-gray-950 border border-gray-300 text-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        >
          <option disabled value=''>Select Location</option>
          {locations.map((location, ind) => 
          <option selected={location === 'Rajarhat'}
          key={ind}>{location}
          </option>)}
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="floor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Floors</label>
        <input 
        type="number" id="floor" 
        onChange={handleChange}
        className="placeholder-gray-500 bg-gray-950 border border-gray-300 text-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
        placeholder="2" 
        required />
      </div>
      <div className="mb-6">
        <label htmlFor="width_road" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Width of Road (m)</label>
        <input 
        type="number" id="width_road" 
        onChange={handleChange}
        className="placeholder-gray-500 bg-gray-950 border border-gray-300 text-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
        placeholder="10" 
        required />
      </div>
      <div className="mb-5 flex items-center ps-4 border border-gray-300 rounded">
        <input id="boundary" 
        type="checkbox"
        onChange={handleCheckbox}
        name="bordered-checkbox" 
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label htmlFor="bordered-checkbox-2" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Has boundaries?</label>
      </div>
      <div className="mb-5 flex items-center ps-4 border border-gray-300 rounded">
        <input id="new_property" 
        type="checkbox"
        onChange={handleCheckbox}
        name="bordered-checkbox" 
        defaultChecked
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label htmlFor="new_property" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is new property?</label>
      </div>
    </div>
    <h2 className='w-full mb-3'>Overlooking:</h2>
    <div className='grid grid-cols-2 gap-4 w-full'>
      <div className="mb-5 flex items-center ps-4 border border-gray-300 rounded">
        <input id="main_road" 
        type="checkbox"
        onChange={handleCheckbox}
        name="bordered-checkbox" 
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label htmlFor="main_road" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Main Road?</label>
      </div>
      <div className="mb-5 flex items-center ps-4 border border-gray-300 rounded">
        <input id="garden_park" 
        type="checkbox"
        onChange={handleCheckbox}
        name="bordered-checkbox" 
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label htmlFor="garden_park" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Garden/Park?</label>
      </div>
    </div>
    <button 
    type="submit"
    onClick={handleSubmit} 
    className="mb-16 mt-5 text-black bg-gray-50 border hover:bg-gray-950 hover:text-gray-50 hover:border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-600 font-medium text-sm w-full px-5 py-2.5 text-center ">      Submit
    </button>
  </div>
  <div></div>
    </>
  )
}

export default ViewPrice