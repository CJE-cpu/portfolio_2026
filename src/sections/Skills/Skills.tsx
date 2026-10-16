import styles from './Skills.module.scss'
import skillData from '../../data/skillData'

const groups = [
  { id: 'frontend', name: 'Frontend', description: '화면 구성 · 인터랙션 · API 연동' },
  { id: 'backend', name: 'Backend', description: '서버 API · 인증 · 데이터 저장' },
  { id: 'tools', name: 'Tools & Testing', description: '버전 관리 · 테스트 · 개발 도구' },
]

const Skills = () => (
  <div className={styles.container}>
    <div className={styles.heading}>
      <div>
        <p className={styles.eyebrow}>TOOLS INTO EXPERIENCE</p>
        <h2 id="skills-heading">Skills</h2>
      </div>
      <p className={styles.introduction}>사용한 기술과 직접 구현한 경험을 함께 정리했습니다.</p>
    </div>
    {groups.map((group) => (
      <section key={group.id} className={styles.group} aria-labelledby={`skills-${group.id}`}>
        <div className={styles.groupHeading}>
          <h3 id={`skills-${group.id}`}>{group.name}</h3>
          <p>{group.description}</p>
        </div>
        <div className={styles.cards}>
          {skillData
            .filter((item) => item.group === group.id)
            .map((item, index) => (
              <article className={styles.card} key={item.category}>
                <div className={styles.cardTop}>
                  <span className={styles.category}>
                    {String(index + 1).padStart(2, '0')} / {item.category}
                  </span>
                  <span className={styles.label}>{item.label}</span>
                </div>
                <div className={styles.titleRow}>
                  <h4>{item.title}</h4>
                  {item.icons && (
                    <div className={styles.icons} aria-hidden="true">
                      {item.icons.map((icon) => (
                        <img
                          key={icon}
                          src={icon}
                          alt=""
                          width={28}
                          height={28}
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <ul className={styles.technologies} aria-label="사용 기술">
                  {item.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <p className={styles.description}>{item.description}</p>
                <p className={styles.evidence}>
                  <span>APPLIED IN</span>
                  {item.evidence}
                </p>
              </article>
            ))}
        </div>
      </section>
    ))}
  </div>
)
export default Skills
