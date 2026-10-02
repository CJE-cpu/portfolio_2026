import styles from './Contact.module.scss'

import githubIcon from '../../assets/github-original.svg'

const Contact = () => (
  <div className={styles.contact_container}>
    <h2 id="contact-heading">Contact</h2>
    <div className={styles.contact_intro}>
      <h3>함께 일할 기회를 기다립니다.</h3>
      <p>채용 관련 문의는 아래 이메일로 보내주세요.</p>
    </div>
    <div className={styles.contact_card}>
      <div className={styles.contact_email}>
        <h3>E-MAIL</h3>
        <a href="mailto:jthe2817@naver.com">jthe2817@naver.com</a>
      </div>
      <div className={styles.contact_github}>
        <h3>GITHUB</h3>
        <a href="https://github.com/CJE-cpu" target="_blank" rel="noopener noreferrer" aria-label="CJE-cpu GitHub (새 탭에서 열림)">
          <span className={styles.contact_link_label}>
            <img className={styles.contact_icon} src={githubIcon} alt="" width="24" height="24" />
            <span>github.com/CJE-cpu</span>
          </span>
        </a>
      </div>
    </div>
  </div>
)
export default Contact
