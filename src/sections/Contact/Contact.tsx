import styles from './Contact.module.scss'

const Contact = () => (
  <div className={styles.contact_container}>
    <h2 id="contact-heading">Contact</h2>
    <div className={styles.contact_card}>
      <div className={styles.contact_email}>
        <h3>E-MAIL</h3>
        <a href="mailto:jthe2817@naver.com">jthe2817@naver.com <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.contact_github}>
        <h3>GITHUB</h3>
        <a href="https://github.com/CJE-cpu" target="_blank" rel="noopener noreferrer" aria-label="CJE-cpu GitHub (새 탭에서 열림)">github.com/CJE-cpu <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </div>
)
export default Contact
