import styles from './About.module.scss'

const About = () => {
  return (
    <div>
      <h2 id="about-heading">About Me</h2>
      <div className={styles.profile}>
        <h3>최정은</h3>
        <div className={styles.info}>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  )
}

export default About
