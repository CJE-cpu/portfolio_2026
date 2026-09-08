import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './sections/About/About'
import Skills from './sections/Skills/Skills'
import Projects from './sections/Projects/Projects'
import Contact from './sections/Contact/Contact'

function App() {
  return (
    <div id="top" className="app">
      <Header />
      <main className="layout main">
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
    </div>
  )
}

export default App
