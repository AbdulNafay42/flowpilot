import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ContactForm } from './components/sections/ContactForm'
import { FeatureTabs } from './components/sections/FeatureTabs'
import { Features } from './components/sections/Features'
import { Hero } from './components/sections/Hero'
import { Pricing } from './components/sections/Pricing'
import { TestimonialSlider } from './components/sections/TestimonialSlider'
import { TrustedCompanies } from './components/sections/TrustedCompanies'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedCompanies />
        <Features />
        <FeatureTabs />
        <TestimonialSlider />
        <Pricing />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
