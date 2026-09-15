import PenguinGame from '../../components/PenguinGame'
import styles from './About.module.scss'

const About = () => (
  <div className={styles.about_container}>
    <div className={styles.intro}>
      <p className={styles.eyebrow}>CJE / FRONTEND PORTFOLIO</p>
      <h2 id="about-heading">ABOUT ME</h2>
      <div className={styles.profile}>
        <h3>생각을 그려내고,<br /><span>웹으로 구현합니다.</span></h3>
        <div className={styles.info}>
          <p>프론트엔드 개발자 최정은입니다.</p>
          <p>React와 TypeScript로 웹을 만들고,<br />수학에서 새로운 아이디어를 찾습니다.</p>
        </div>
      </div>
      <a className={styles.workLink} href="#projects">프로젝트 살펴보기 <span aria-hidden="true">↗</span></a>
    </div>
    <PenguinGame />
  </div>
)

export default About
