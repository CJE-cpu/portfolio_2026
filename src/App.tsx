import Header from './components/Header'
import Footer from './components/Footer'
import About from './sections/About/About'
import Skills from './sections/Skills/Skills'
import Projects from './sections/Projects/Projects'
import Contact from './sections/Contact/Contact'
import TopButton from './components/TopButton'

import { useEffect, useRef, useState } from 'react'
import DeskIntro from './components/DeskIntro'
import styles from './App.module.scss'

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (window.location.hash) return false
    try { return sessionStorage.getItem('cje-desk-seen') !== 'true' }
    catch { return true }
  })
  const destination = useRef<string | null>(null)
  const enter = (target = 'about') => {
    destination.current = target
    try { sessionStorage.setItem('cje-desk-seen', 'true') } catch { /* Storage may be unavailable. */ }
    setShowIntro(false)
  }
  useEffect(() => {
    if (showIntro || !destination.current) return
    const target = destination.current
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(target)
      if (section) {
        section.tabIndex = -1
        section.focus({ preventScroll: true })
        section.scrollIntoView({ behavior: 'instant', block: 'start' })
        history.replaceState(null, '', `#${target}`)
      }
      destination.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [showIntro])
  return (
    <>
    {showIntro ? <DeskIntro onEnter={enter} /> : <div key="portfolio" id="top" className="app">
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
      <div className={styles.deskReturn}>
        <button className={styles.deskButton} type="button" onClick={() => { destination.current = null; history.replaceState(null, '', window.location.pathname + window.location.search); setShowIntro(true); window.scrollTo({ top: 0, behavior: 'instant' }) }}>
          <span className={styles.deskIcon} aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h18M5 13v8m14-8v8M6 10h5v3H6zm9 3V9m-3 0 3-6 3 6h-6Z" /></svg>
          </span>
          <span className={styles.deskLabel}><small>BACK TO MY DESK</small><span>책상 다시 둘러보기</span></span>
          <svg className={styles.returnArrow} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10h10a6 6 0 0 1 0 12M8 6l-4 4 4 4" transform="translate(0 -2)" /></svg>
        </button>
      </div>
      <TopButton />
    </div>}
    </>
  )
}

export default App
