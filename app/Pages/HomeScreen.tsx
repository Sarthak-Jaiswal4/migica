import { HomePageCarosol } from '../../components/HomePageCarosol'
import { Headers } from '../../components/Headers'
import { BestSelling } from '../../components/BestSelling'
import { CraftStorySection } from '../../components/CraftStorySection'
import { CategoriesShop } from '../../components/CategoriesShop'
import { CompleteTheSetSection } from '../../components/CompleteTheSetSection'
import { Testimonials } from '../../components/Testimonials'
import { Footer } from '../../components/Footer'

function HomeScreen() {
  return (
    <>
      <div className='w-full h-full relative bg-[#F6F4F1]'>
        <Headers />
        <div className='h-screen w-full bg-[#F6F4F1]'>
          <HomePageCarosol />
        </div>
        <CraftStorySection />
        <CategoriesShop />
        <CompleteTheSetSection />
        <div className='min-h-screen w-full'>
          <BestSelling />
        </div>
        <Testimonials />
        <Footer />
      </div>
    </>
  )
}

export default HomeScreen