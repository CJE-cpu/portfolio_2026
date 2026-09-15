import styles from './Projects.module.scss'
import projectData from '../../data/projectData'

const Projects = () => (
  <div className={styles.project_container}>
    <h2 id="projects-heading">Projects</h2>
    <div className={styles.projects}>
      {projectData.map((project, index) => (
        <article key={project.name} className={styles.projectCard} aria-label={project.name}>
          <div className={`${styles.preview} ${project.img ? styles.imagePreview : ''}`} aria-hidden={project.img ? undefined : true}>
            {project.img ? <img src={project.img} alt={`${project.name} 사이트 화면`} loading="lazy" decoding="async" /> : (
              <>
                <span className={styles.figure}>FIG. 0{index + 1}</span>
                <svg viewBox="0 0 360 160" fill="none">
                  <path d="M20 120H340M50 145V15" stroke="currentColor" opacity=".3" />
                  <path d={['M25 130Q180 -65 335 110', 'M25 85C90 -35 125 205 195 85S285 -20 335 65', 'M30 125L95 100L160 110L225 45L330 25', 'M30 115C170 115 180 35 330 35', 'M30 120L90 120L90 85L155 85L155 100L225 100L225 40L330 40'][index % 5]} stroke="currentColor" strokeWidth="2.5" />
                </svg>
                <span className={styles.previewName}>{project.name}</span>
              </>
            )}
          </div>
          <div className={styles.cardContent}>
            <span className={styles.number}>PROJECT / 0{index + 1}</span>
            <h3 className={styles.projectTitle}>{project.name}</h3>
            {project.description && <p>{project.description}</p>}
            {project.skill && <p className={styles.skill}>{project.skill}</p>}
            {project.siteUrl ? (
              <a className={styles.projectLink} href={project.siteUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} 사이트 보기 (새 탭에서 열림)`}>
                사이트 보기 <span aria-hidden="true">↗</span>
              </a>
            ) : <p className={styles.skill}>준비 중</p>}
          </div>
        </article>
      ))}
    </div>
  </div>
)
export default Projects
