// ─── SMART AI ACCESS — APP COMPONENT ─────────────────────────────────────────
import { PrebookProvider } from '@/contexts/PrebookContext'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import PrebookModal from '@/components/layout/PrebookModal'
import CountdownPopup from '@/components/layout/CountdownPopup'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/features/Hero'
import SupportedMarkets from '@/components/features/SupportedMarkets'
import Features from '@/components/features/Features'
import Pricing from '@/components/features/Pricing'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/features/Chatbot'
import ContactTab from '@/components/layout/ContactTab'
import { FluidBg } from '@/components/ui/FluidBg'
import TradingChartScroll from '@/components/features/TradingChartScroll'

export default function App() {
  console.log('App component rendering...')
  return (
    <PrebookProvider>
      <AnimatedBackground />
      <main className="min-h-screen flex flex-col bg-transparent relative z-[1]">
        {/* <CountdownPopup /> */}
        
        {/* Top Section */}
        <div className="relative w-full pointer-events-none">
          <div className="absolute inset-0 pointer-events-auto z-0">
            {/* <FluidBg /> */}
          </div>
          
          <div className="relative z-10 pointer-events-none">
            <Navbar />
            <div className="pt-[20px] sm:pt-[40px]">
              <Hero />
              <SupportedMarkets />
            </div>
          </div>
        </div>

        <div className="relative z-10 pointer-events-auto">
          <TradingChartScroll />
        </div>

        <div className="flex-1 relative z-10 pointer-events-auto">
          <Features />
          <Pricing />
        </div>

        <Footer />
        <PrebookModal />
      </main>

      {/* Floating elements — rendered outside main so they are always on top */}
      <Chatbot />
      <ContactTab />
    </PrebookProvider>
  )
}