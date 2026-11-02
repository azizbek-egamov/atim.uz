import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Roadmap from './components/Roadmap'
import Certificates from './components/Certificates'
import Partners from './components/Partners'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'

export default function App() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Roadmap />
        <Certificates />
        <Partners />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
