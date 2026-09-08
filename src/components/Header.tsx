import styles from './Header.module.scss'

const Header = () => {
  return (
    <header className={styles.header}>
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
