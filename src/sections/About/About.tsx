import { motion, useReducedMotion } from 'motion/react'
import styles from './About.module.scss'
import PenguinPlayground from '../../components/PenguinPlayground'

const About = () => {
  const reduced = useReducedMotion()
  const reveal = (delay = 0) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 28, rotateX: -12 },
    whileInView: { opacity: 1, y: 0, rotateX: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay },
  })
  return (
    <div className={styles.about_container}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>CJE / FRONTEND PORTFOLIO</p>
        <h2 id="about-heading">ABOUT ME</h2>
        <div className={styles.profile}>
          <motion.h3 {...reveal()}>
            사용자의 화면과
            <br />
            <span className={styles.highlight}>
              데이터의 흐름을 잇습니다.
              <motion.i
                aria-hidden="true"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : 0.5, duration: reduced ? 0 : 0.75 }}
              />
            </span>
          </motion.h3>
          <div className={styles.info}>
            <p>프론트엔드 개발자 최정은입니다.</p>
            <p>
              React와 TypeScript로 사용자 화면을 만들고, Spring Boot와 MySQL로 입력부터 저장까지
              이어지는 흐름을 구현하고 있습니다.
            </p>
            <p>
              기능의 완성뿐 아니라 요청을 기다리는 순간, 실패했을 때의 안내, 다시 시도하는 과정까지
              생각합니다.
            </p>
          </div>
        </div>
        <ul className={styles.stack} aria-label="주요 사용 기술">
          {['React', 'TypeScript', 'Spring Boot', 'MySQL'].map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <div className={styles.profileActions}>
          <a className={styles.workLink} href="#projects">
            프로젝트 살펴보기 ↗
          </a>
          <a
            className={styles.workLink}
            href="https://github.com/CJE-cpu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 코드 보기 (새 탭)"
          >
            GitHub 코드 보기 ↗
          </a>
          <a className={styles.contactLink} href="#contact">
            채용 문의
          </a>
        </div>
      </div>
      <PenguinPlayground />
    </div>
  )
}

export default About
