import { HomePageCarosol } from '../../components/HomePageCarosol'
import { Headers } from '../../components/Headers'
import { BestSelling } from '../../components/BestSelling'
import { CategoriesShop } from '../../components/CategoriesShop'
import { Footer } from '../../components/Footer'

function HomeScreen() {
  return (
    <>
      <div className='w-full h-full relative bg-[#F6F4F1]'>
        <Headers />
        <div className='h-screen w-full bg-[#F6F4F1]'>
          <HomePageCarosol />
        </div>
        <CategoriesShop />
        <div className='min-h-screen w-full'>
          <BestSelling />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default HomeScreen