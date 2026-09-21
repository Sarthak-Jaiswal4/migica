import { HomePageCarosol } from '../../components/HomePageCarosol'
import { Headers } from '../../components/Headers'
import { MidPageBestSellers } from '../../components/MidPageBestSellers'
import { CraftStorySection } from '../../components/CraftStorySection'
import { NewArrivalsSection } from '../../components/NewArrivalsSection'
import { CategoriesShop } from '../../components/CategoriesShop'
import { CompleteTheSetSection } from '../../components/CompleteTheSetSection'
import { Testimonials } from '../../components/Testimonials'
import { Footer } from '../../components/Footer'
import { CategoryGrid } from '../../components/CategoryGrid'
import { HappyCustomers } from '../../components/HappyCustomers'
import { ExhibitionGallery } from '@/components/about/ExhibitionGallery'
import { AboutTestimonials } from '@/components/about/AboutTestimonials'

function HomeScreen() {
  return (
    <>
      <div className='w-full h-full relative bg-background'>
        <h1 className="sr-only">Handmade Candles, Jewellery & Gifts — Silver Star</h1>
        <Headers />
        <div className='h-[80vh] w-full bg-background'>
          <HomePageCarosol />
        </div>
        <CategoryGrid />
        <CraftStorySection />
        <NewArrivalsSection />
        <CategoriesShop midPageSlot={<MidPageBestSellers />} />
        <CompleteTheSetSection />
        <HappyCustomers />
        <ExhibitionGallery/>
        <AboutTestimonials />
        <Footer />
      </div>
    </>
  )
}

export default HomeScreen
