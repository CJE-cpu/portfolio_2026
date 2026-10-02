import Header from './components/Header'
import Footer from './components/Footer'
import About from './sections/About/About'
import Skills from './sections/Skills/Skills'
import Projects from './sections/Projects/Projects'
import Contact from './sections/Contact/Contact'
import TopButton from './components/TopButton'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import TicTacToeIntro from './components/TicTacToeIntro'

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (window.location.hash) return false
    try { return sessionStorage.getItem('cje-intro-seen') !== 'true' }
    catch { return true }
  })
  const enter = () => {
    try { sessionStorage.setItem('cje-intro-seen', 'true') } catch { /* Storage may be unavailable. */ }
    setShowIntro(false)
  }
  return (
    <AnimatePresence mode="wait" onExitComplete={() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      window.requestAnimationFrame(() => document.getElementById('portfolio-main')?.focus({ preventScroll: true }))
    }}>
    {showIntro ? <TicTacToeIntro key="intro" onEnter={enter} /> : <div key="portfolio" id="top" className="app">
      <Header />
      <main id="portfolio-main" tabIndex={-1} className="layout main">
        <section id="about" className="section" aria-labelledby="about-heading">
          <About />
        </section>
        <section id="skills" className="section" aria-labelledby="skills-heading">
          <Skills />
        </section>
        <section id="projects" className="section" aria-labelledby="projects-heading">
          <Projects />
        </section>
        <section id="contact" className="section" aria-labelledby="contact-heading">
          <Contact />
        </section>
      </main>
      <Footer />
      <TopButton />
    </div>}
    </AnimatePresence>
  )
}

export default App
