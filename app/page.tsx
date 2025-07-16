// import Navbar from '@/components/Navbar'
// import AboutUsSection from './components/AboutUsSection'
import CuratedCollection from "@/components/CuratedCollection"
import HeroSection from "@/components/HeroSection"
import AboutPage from '@/components/About'

export default function Home() {
  return (
    <>
        <main className="relative w-full h-screen overflow-hidden">

      <HeroSection />

      </main>
      <CuratedCollection />
      <AboutPage />
      </>
  )
}