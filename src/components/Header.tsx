import styles from './Header.module.scss'

import { useLayoutEffect, useRef } from 'react'

const Header = () => {
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    const app = header?.parentElement
    if (!header || !app) return

    const updateHeight = () => {
      app.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)

    return () => {
      observer.disconnect()
      app.style.removeProperty('--header-height')
    }
  }, [])

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={`layout ${styles.inner}`}>
        <h1 className={styles.logo}><a href="#top">CJE's Portfolio</a></h1>
        <nav className={styles.nav} aria-label="주 메뉴">
          <a href="#about">about</a>
          <a href="#skills">skills</a>
          <a href="#projects">projects</a>
          <a href="#contact">contact</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
