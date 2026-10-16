import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { DeskItem, DeskView } from './deskScene'
import styles from './DeskIntro.module.scss'

const items: { id: DeskItem; name: string; label: string; target?: string }[] = [
  { id: 'book', name: '책', label: 'PROJECTS', target: 'projects' },
  { id: 'note', name: '노트', label: 'ABOUT', target: 'about' },
  { id: 'mug', name: '머그컵', label: 'SKILLS', target: 'skills' },
  { id: 'lamp', name: '램프', label: 'LIGHT ON / OFF' },
  { id: 'postit', name: '포스트잇', label: 'CONTACT', target: 'contact' },
]

function DeskIcon({ name }: { name: DeskItem | DeskView }) {
  const paths = {
    book: 'M5 4h14v16H7a2 2 0 0 1-2-2V4Zm0 12h14M9 4v8m4-4h3',
    note: 'M6 3h14v18H6V3ZM3 7h5M3 12h5M3 17h5m8-10h4m-4 5h4m-4 5h4',
    mug: 'M4 8h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm12 1h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3',
    lamp: 'M8 3h8l4 10H4L8 3Zm4 10v7m-5 1h10m0-8v4',
    postit: 'M4 4h16v11l-5 5H4V4Zm11 16v-5h5M8 9h8m-8 4h4',
    front: 'M3 6h18v12H3V6Zm4 12v3m10-3v3M3 14h18',
    top: 'M4 4h16v16H4V4Zm0 8h16M12 4v16',
    angle: 'm12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8m-9 5v9',
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}

export default function DeskIntro({ onEnter }: { onEnter: (target?: string) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<Awaited<
    ReturnType<(typeof import('./deskScene'))['createDeskScene']>
  > | null>(null)
  const enterRef = useRef(onEnter)
  useEffect(() => {
    enterRef.current = onEnter
  }, [onEnter])
  const [hovered, setHovered] = useState<DeskItem | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [lampOn, setLampOn] = useState(true)
  const reduce = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    import('./deskScene')
      .then(({ createDeskScene }) => {
        if (cancelled || !host.current) return
        try {
          scene.current = createDeskScene(
            host.current,
            (id) => {
              const target = items.find((item) => item.id === id)?.target
              if (target) enterRef.current(target)
            },
            setHovered,
            setLampOn,
          )
          setState('ready')
        } catch {
          setState('error')
        }
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
      scene.current?.dispose()
      scene.current = null
    }
  }, [])

  return (
    <motion.main
      className={styles.intro}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
    >
      <header className={styles.header}>
        <div className={styles.identity}>
          <span>CJE / PORTFOLIO</span>
          <h1>프론트엔드 개발자 최정은</h1>
        </div>
        <button className={styles.enterButton} type="button" onClick={() => onEnter()}>
          <span className={styles.enterLabel}>
            <small>EXPLORE MY WORK</small>
            <span>바로 들어가기</span>
          </span>
          <span className={styles.enterArrow} aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </span>
        </button>
      </header>
      <div className={styles.stage}>
        <div ref={host} className={styles.canvas} />
        {state !== 'ready' && (
          <p className={styles.fallback} role="status">
            {state === 'loading'
              ? '책상을 준비하고 있어요…'
              : '3D 화면을 불러오지 못했어요. 아래 메뉴로 둘러보세요.'}
          </p>
        )}
        <p className={styles.hint}>
          {hovered
            ? `${items.find((item) => item.id === hovered)?.name} · ${items.find((item) => item.id === hovered)?.label}`
            : '책 · 노트 · 머그컵 · 램프 · 포스트잇'}
        </p>
      </div>
      <nav className={styles.objects} aria-label="책상 오브젝트 메뉴">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            data-object={item.id}
            disabled={item.id === 'lamp' && state !== 'ready'}
            aria-pressed={item.id === 'lamp' ? lampOn : undefined}
            onFocus={() => scene.current?.highlight(item.id)}
            onBlur={() => scene.current?.highlight(null)}
            onMouseEnter={() => scene.current?.highlight(item.id)}
            onMouseLeave={() => scene.current?.highlight(null)}
            onClick={() => {
              if (item.target) onEnter(item.target)
              else scene.current?.select(item.id)
            }}
          >
            <span className={styles.objectIcon}>
              <DeskIcon name={item.id} />
            </span>
            <span className={styles.objectText}>
              <span>{item.name}</span>
              <strong>
                {item.id === 'lamp' ? (lampOn ? 'LIGHT ON' : 'LIGHT OFF') : item.label}
              </strong>
            </span>
          </button>
        ))}
      </nav>
      <footer className={styles.footer}>
        <span>THINK · BUILD · PLAY</span>
        <span>드래그해서 둘러보기 · 물건을 클릭해 이동하기</span>
      </footer>
    </motion.main>
  )
}
