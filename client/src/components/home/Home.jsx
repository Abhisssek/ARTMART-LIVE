import React from 'react'
import { Navbar } from '../Navbar/Navbar'
import { Hero } from '../hero/Hero'
import { DiscoverSection } from '../discover/Discover'
import { ArtisticEndeavor } from '../artistic/ArtisticEndeavor'
import { SpecialSection } from '../special/SpecialSelection'
import { Footer } from '../footer/Footer'

export const Home = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <DiscoverSection />
        <ArtisticEndeavor />
        <SpecialSection />
        <Footer />
    </div>
  )
}
