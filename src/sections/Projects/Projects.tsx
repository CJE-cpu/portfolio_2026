import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.scss'
import projectData from '../../data/projectData'

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const media = gsap.matchMedia()
    media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = root.querySelectorAll<HTMLElement>('[data-project-panel]')
      const sheets = root.querySelectorAll<HTMLElement>('[data-project-sheet]')
      // Sticky positioning respects the header; the next panel drives each reveal.
      sheets.forEach((sheet, index) => {
        if (!panels[index + 1]) return
        gsap.fromTo(sheet, { clipPath: 'inset(0% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 100% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: panels[index + 1],
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    }, root)
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(frame)
      media.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.project_container}>
      <h2 id="projects-heading">Projects</h2>
      <div className={styles.projects}>
        <div className={styles.details}>
          {projectData.map((project, index) => (
            <article key={project.name} className={styles.projectPanel} data-project-panel aria-labelledby={`project-title-${index}`}>
              <div className={styles.cardContent}>
                <span className={styles.number}>PROJECT / {String(index + 1).padStart(2, '0')}</span>
                <h3 id={`project-title-${index}`} className={styles.projectTitle}>{project.name}</h3>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.skills}>
                  {project.skill.split(',').map(skill => <span key={skill.trim()}>{skill.trim()}</span>)}
                </div>
                <p className={styles.team}>{project.team === 1 ? '개인 프로젝트' : `팀 프로젝트 · ${project.team}명`}</p>
                {project.siteUrl ? (
                  <a className={styles.projectLink} href={project.siteUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} 사이트 보기 (새 탭에서 열림)`}>
                    사이트 보기
                  </a>
                ) : <p className={styles.team}>준비 중</p>}
              </div>
              <figure className={styles.inlinePreview}>
                {project.img && <img src={project.img} alt={`${project.name} 사이트 화면`} loading="lazy" decoding="async" />}
              </figure>
            </article>
          ))}
        </div>
        <div className={styles.previewColumn} aria-hidden="true">
          <div className={styles.previewStage}>
            {projectData.map((project, index) => (
              <div key={project.name} data-project-sheet className={styles.paperSheet} style={{ zIndex: projectData.length - index }}>
                <div className={styles.sheetLabel}><span>SELECTED WORK</span><span>{String(index + 1).padStart(2, '0')} / {String(projectData.length).padStart(2, '0')}</span></div>
                {project.img && <img src={project.img} alt="" decoding="async" />}
                <div className={styles.sheetCaption}><span>{project.name}</span><span>SCROLL TO EXPLORE</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects
