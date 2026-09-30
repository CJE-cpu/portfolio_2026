import styles from './Projects.module.scss'
import projectData from '../../data/projectData'

// | 항목 | 들어갈 내용 |
// |---|---|
// | 소개 | 누구를 위해 어떤 기능을 만든 서비스인지 |
// | 기간·인원·역할 | 개발 기간, 개인/팀 구분, 직접 담당한 범위 |
// | 주요 기능 | 핵심 기능 3개 정도와 화면 |
// | 기술 선택 | 사용 기술과 선택한 이유 |
// | 문제 해결 | 발생한 문제 → 원인 → 해결 방법 → 결과 |
// | 회고 | 배운 점과 다음에 개선할 부분 |
// | 링크 | 실행 사이트, GitHub, 상세 README |

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
            <span>
              {project.team === 1
                ? '개인 프로젝트'
                : `팀 프로젝트 · ${project.team}명`}
            </span>
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
