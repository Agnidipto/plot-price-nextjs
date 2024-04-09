import Link from 'next/link'
import ViewPrice from './Components/ViewPrice'
import LeftContent from './Components/LeftContent'
import ScrollToTopButton from './Components/ScrollToTopButton'

export default async function Home() {
  return (<>
      <div className='grid grid-cols-1 xl:grid-cols-2'>
        <div className="xl:order-1 order-2 flex h-screen flex-col items-center justify-between">
          <LeftContent />
        </div>
        <div className="xl:order-2 order-1 flex h-screen flex-col items-center justify-between px-5 ">
          <ViewPrice />
        </div>
      </div>
      <ScrollToTopButton />
      
      </>
  )
}
