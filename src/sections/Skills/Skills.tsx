import styles from './Skills.module.scss'
import skillData from '../../data/skillData'

const Skills = () => (
  <div className={styles.skills_container}>
    <h2 id="skills-heading">Skills</h2>
    <div className={styles.skills_card}>
      {skillData.map((item) => (
        <div className={styles.skill} key={item.name}>
          {item.imgUrl && (
            <img className={styles.icon} src={item.imgUrl} alt="" width={48} height={48} loading="lazy" decoding="async" />
          )}
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  </div>
)
export default Skills
