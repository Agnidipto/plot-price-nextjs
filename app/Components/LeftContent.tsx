
import KolkataStreetView from './KolkataStreetView';
const LeftContent = () => {
  return ( <>
    <div className='container'>
      <div className='h-full w-full'>
        <KolkataStreetView />
      </div>
      <div className="overlay-text flex flex-col justify-center items-center h-full">
        <div className='border border-white/30 md:p-10 md:w-3/5 p-5 w-5/6 flex flex-col justify-center items-center default-pointer'>
        <h1 className="text-3xl">Kolkata</h1>
        <h1 className="text-5xl">Plot Price</h1>
        <p className="mt-5">The App predicts the price of a plot of land in the city of Kolkata, India. The algorithm used <strong>Neural Networks</strong> to achieve the result. The data is scraped via <strong>Selenium and BS4</strong>.</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default LeftContent