// ─── SMART AI ACCESS — APP COMPONENT ─────────────────────────────────────────
import { PrebookProvider } from '@/contexts/PrebookContext'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import PrebookModal from '@/components/layout/PrebookModal'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/features/Hero'
import SupportedMarkets from '@/components/features/SupportedMarkets'
import Features from '@/components/features/Features'
import Pricing from '@/components/features/Pricing'
import Footer from '@/components/layout/Footer'

export default function App() {
  return (
    <PrebookProvider>
      <AnimatedBackground />
      <main className="min-h-screen flex flex-col bg-transparent relative z-[1]">
        <Navbar />

        <div className="flex-1 pt-[80px] relative z-10">
          <Hero />
          <SupportedMarkets />
          <Features />
          <Pricing />
        </div>

        <Footer />
        <PrebookModal />
      </main>
    </PrebookProvider>
  )
}
