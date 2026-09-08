import styles from './Projects.module.scss'
import projectData from '../../data/projectData'

const Projects = () => {
  return (
    <div className={styles.project_container}>
      <h2 id="projects-heading">Projects</h2>
      <div className={styles.projects}>
        {projectData.map((project, index) => (
          <article
            key={project.name}
            className={styles.projectCard}
            aria-label={`프로젝트 카드 ${index + 1}, 내용 준비 중`}
          >
            <div className={styles.imagePlaceholder} aria-hidden="true" />
            <div className={styles.cardContent} aria-hidden="true">
              <div className={styles.titlePlaceholder} />
              <div className={styles.descriptionPlaceholder}>
                <span />
                <span />
              </div>
              <div className={styles.tagsPlaceholder}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Projects
