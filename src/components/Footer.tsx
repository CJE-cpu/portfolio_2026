import styles from './Footer.module.scss'
const Footer = () => (
  <footer className={`layout ${styles.footer}`}>
    <p>© {new Date().getFullYear()} CJE</p>
  </footer>
)
export default Footer
