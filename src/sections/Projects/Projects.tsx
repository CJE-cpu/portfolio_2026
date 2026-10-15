import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import HTMLFlipBook from 'react-pageflip'
import styles from './Projects.module.scss'
import projectData from '../../data/projectData'

type FlipApi = {
  turnToPage: (page: number) => void
  flip: (page: number, corner: 'bottom' | 'top') => void
  destroy: () => void
}
const featured = ['L:CODE', 'shoppingmall', '멍냥허브']
const projects = [...featured.flatMap(name => projectData.filter(p => p.name === name)), ...projectData.filter(p => !featured.includes(p.name))]

export default function Projects() {
  const book = useRef<{ pageFlip: () => FlipApi | undefined } | null>(null)
  useEffect(() => {
    const handle = book.current
    return () => handle?.pageFlip()?.destroy()
  }, [])
  const [leaf, setLeaf] = useState(0)
  const [portrait, setPortrait] = useState(false)
  const [busy, setBusy] = useState(false)
  const reduced = useReducedMotion()
  const page = Math.floor(leaf / 2)
  const project = projects[page]
  const go = (target: number) => {
    const api = book.current?.pageFlip()
    if (!api || busy || target < 0 || target >= projects.length * 2) return
    if (reduced) api.turnToPage(target)
    else api.flip(target, 'bottom')
  }
  const step = portrait ? 1 : 2
  const last = portrait ? projects.length * 2 - 1 : projects.length * 2 - 2
  const pages = useMemo(() => projects.flatMap((project, index) => [
            <div key={`${project.name}-details`} className={styles.sheet} data-density="soft"><div className={styles.leftPage}>
              <p className={styles.eyebrow}>{index < 3 ? 'SELECTED WORK' : 'MORE WORK'} / {String(index + 1).padStart(2, '0')}</p>
              <h3 id={`project-title-${index}`}>{project.name}</h3>
              <p className={styles.team}>{project.team === 1 ? '개인 프로젝트' : `팀 프로젝트 · ${project.team}명`}</p>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.skills} aria-label="사용 기술">{project.skill.split(',').map(skill => <span key={skill.trim()}>{skill.trim()}</span>)}</div>
              <span className={styles.pageMark}>IDEA → BUILD → EXPERIENCE</span>
            </div>
            </div>,
            <div key={`${project.name}-preview`} className={styles.sheet} data-density="soft"><div className={styles.rightPage}>
              <p className={styles.eyebrow}>IN THE FRAME</p>
              <figure className={styles.preview}>
                <img src={project.img} alt={`${project.name} 웹사이트 화면`} decoding="async" draggable={false} />
                <figcaption>{project.name}<span>WEB PROJECT</span></figcaption>
              </figure>
              {project.siteUrl && <a className={styles.link} href={project.siteUrl} target="_blank" rel="noopener noreferrer">사이트 둘러보기 <span aria-hidden="true">↗</span><span className={styles.srOnly}> (새 탭에서 열림)</span></a>}
            </div>
            </div>
  ]), [])
  return (
    <div className={styles.container}>
      <div className={styles.heading}><div><p className={styles.eyebrow}>A NOTEBOOK OF MY WORK</p><h2 id="projects-heading">Projects</h2></div></div>
      <nav className={styles.tabs} aria-label="프로젝트 인덱스">
        {projects.map((item, i) => <button key={item.name} type="button" disabled={busy} aria-current={page === i ? 'true' : undefined} aria-controls="project-notebook" onClick={() => go(i * 2)}><span>{String(i + 1).padStart(2, '0')}</span>{item.name}</button>)}
      </nav>
      <div className={styles.book} id="project-notebook" role="region" aria-label="프로젝트 노트" tabIndex={0}
        onKeyDown={e => {
          if (e.target !== e.currentTarget) return
          if (e.key === 'ArrowRight') { e.preventDefault(); go(leaf + step) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(leaf - step) }
          if (e.key === 'Home') { e.preventDefault(); go(0) }
          if (e.key === 'End') { e.preventDefault(); go(last) }
        }}>
        <HTMLFlipBook ref={book} className={styles.flipbook} style={{}} width={520} height={680}
          size="stretch" minWidth={280} maxWidth={580} minHeight={640} maxHeight={760}
          startPage={0} drawShadow={!reduced} flippingTime={750} usePortrait startZIndex={0}
          autoSize maxShadowOpacity={0.3} showCover={false} mobileScrollSupport={false}
          clickEventForward useMouseEvents={!reduced} swipeDistance={45}
          showPageCorners={!reduced} disableFlipByClick renderOnlyPageLengthChange
          onInit={e => { setLeaf(e.data.page); setPortrait(e.data.mode === 'portrait') }}
          onFlip={e => setLeaf(e.data)}
          onChangeOrientation={e => setPortrait(e.data === 'portrait')}
          onChangeState={e => setBusy(e.data === 'flipping' || e.data === 'user_fold')}>
          {pages}
        </HTMLFlipBook>
      </div>
      <div className={styles.controls}>
        <button type="button" disabled={leaf === 0 || busy} onClick={() => go(leaf - step)} aria-controls="project-notebook">← 이전 페이지</button>
        <span className={styles.counter} aria-live="polite" aria-atomic="true"><span className={styles.srOnly}>{project.name}, </span>{String(page + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}{portrait && <small className={styles.sideLabel}>{leaf % 2 === 0 ? '소개' : '화면'}</small>}</span>
        <button type="button" disabled={leaf >= last || busy} onClick={() => go(leaf + step)} aria-controls="project-notebook">다음 페이지 →</button>
      </div>
      <p className={styles.hint}>{reduced ? '인덱스와 이전·다음 버튼으로 이동할 수 있어요.' : '페이지 모서리를 잡아 넘겨보세요. 모바일에서는 한 장씩 좌우로 밀어볼 수 있어요.'}</p>
    </div>
  )
}
