import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './PenguinPlayground.module.scss'

type Action = 'hello' | 'jump' | 'sleep' | 'walk' | 'feed' | 'full'
const responses: Record<Action, string> = {
  hello: '반가워요! 잠깐 같이 놀다 갈래요?',
  jump: '하나, 둘… 폴짝! 기분이 좋아졌어요.',
  sleep: '잠깐 충전할게요… 저를 누르면 깨어나요.',
  walk: '불렀어요? 지금 그쪽으로 갈게요!',
  feed: '물고기다! 냠냠, 맛있게 먹을게요.',
  full: '잘 먹었어요! 덕분에 힘이 났어요.',
}

export default function PenguinPlayground() {
  const reduced = useReducedMotion()
  const [position, setPosition] = useState(0.5)
  const [action, setAction] = useState<Action>('hello')
  const [turn, setTurn] = useState(0)
  const [chewing, setChewing] = useState(false)
  useEffect(() => {
    for (const name of ['penguin-sleep', 'penguin-eat', 'penguin-fish']) {
      const image = new Image()
      image.src = `/images/progress/${name}.png`
    }
  }, [])
  useEffect(() => {
    if (action !== 'feed') return
    const bite = window.setTimeout(() => setChewing(true), reduced ? 0 : 650)
    const finish = window.setTimeout(() => {
      setChewing(false)
      setAction('full')
      setTurn((value) => value + 1)
    }, 2600)
    return () => {
      window.clearTimeout(bite)
      window.clearTimeout(finish)
    }
  }, [action, turn, reduced])
  const play = (next: Action) => {
    setChewing(false)
    setAction(next)
    setTurn((value) => value + 1)
  }
  const move = (next: number) => {
    setPosition(Math.min(1, Math.max(0, next)))
    play('walk')
  }
  const animations = {
    hello: { rotate: [0, -10, 10, -7, 7, 0], y: [0, -5, 0] },
    jump: { y: [0, 6, -75, 0, -12, 0], scaleY: [1, 0.9, 1.05, 0.92, 1, 1] },
    sleep: { rotate: [0, -3], y: [0, 5], scale: [1, 0.97] },
    walk: { rotate: [0, -8, 8, -8, 8, 0], y: [0, -4, 0, -4, 0] },
    feed: { rotate: [0, -3, 3, -3, 3, 0], scaleY: [1, 0.96, 1, 0.96, 1] },
    full: { rotate: [0, -5, 5, 0], y: [0, -7, 0] },
  }
  return (
    <div className={styles.playground} aria-labelledby="penguin-play-heading">
      <div className={styles.heading}>
        <span>OFF THE RECORD / 잠깐 쉬어가기</span>
        <h3 id="penguin-play-heading">펭귄의 작은 놀이터</h3>
        <p>빈 곳을 톡 누르면 따라가요. 펭귄에게 인사도 해보세요.</p>
      </div>
      <div className={styles.scene} data-night={action === 'sleep'}>
        <div className={styles.sun} aria-hidden="true" />
        <div className={styles.moon} aria-hidden="true" />
        <div className={styles.stars} aria-hidden="true">
          ✦<span>✧</span>
          <span>✦</span>
          <span>·</span>
          <span>✧</span>
        </div>
        <div className={styles.hill} aria-hidden="true" />
        <div className={styles.hillTwo} aria-hidden="true" />
        <button
          type="button"
          className={styles.ground}
          aria-label="펭귄 이동: 클릭하거나 좌우 방향키를 누르세요"
          onClick={(event) => {
            // Keyboard activation has no pointer coordinates.
            if (event.detail === 0) {
              move(0.5)
              return
            }
            const rect = event.currentTarget.getBoundingClientRect()
            move((event.clientX - rect.left - 88) / Math.max(1, rect.width - 176))
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              move(position + (event.key === 'ArrowLeft' ? -0.15 : 0.15))
            }
          }}
        >
          <span>CLICK TO EXPLORE · 톡, 여기로!</span>
        </button>
        <motion.div
          className={styles.character}
          animate={{ left: `calc(16px + ${position * 100}% - ${position * 176}px)` }}
          transition={{ duration: reduced ? 0 : 0.7, ease: 'easeInOut' }}
        >
          <span className={styles.shadow} aria-hidden="true" />
          <button
            type="button"
            className={styles.penguin}
            aria-label={action === 'sleep' ? '펭귄 깨우기' : '펭귄과 인사하기'}
            onClick={() => play('hello')}
          >
            <motion.img
              key={`${turn}-${chewing}`}
              src={`/images/progress/${action === 'sleep' ? 'penguin-sleep' : action === 'feed' && chewing ? 'penguin-eat' : 'penguin-guide'}.png`}
              width="144"
              height="144"
              alt=""
              draggable={false}
              initial={false}
              animate={reduced ? { rotate: 0 } : animations[action]}
              transition={{
                duration: reduced ? 0 : action === 'jump' ? 0.9 : 0.75,
                ease: 'easeInOut',
              }}
            />
          </button>
          {action === 'feed' && !chewing && (
            <motion.img
              className={styles.fish}
              src="/images/progress/penguin-fish.png"
              width="56"
              height="56"
              alt=""
              aria-hidden="true"
              initial={reduced ? false : { y: -95, x: 20, rotate: -25, opacity: 0 }}
              animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.65, ease: 'easeIn' }}
            />
          )}
          {action === 'sleep' && (
            <span className={styles.sleep} aria-hidden="true">
              z Z z
            </span>
          )}
          {action === 'jump' && (
            <span key={turn} className={styles.star} aria-hidden="true">
              ✦
            </span>
          )}
        </motion.div>
      </div>
      <p className={styles.message} role="status">
        {responses[action]}
      </p>
      <div className={styles.controls} aria-label="펭귄과 놀기">
        <button type="button" onClick={() => play('hello')}>
          인사하기
        </button>
        <button type="button" onClick={() => play('jump')}>
          폴짝 뛰기
        </button>
        <button type="button" disabled={action === 'feed'} onClick={() => play('feed')}>
          <img src="/images/progress/penguin-fish.png" alt="" width="28" height="28" />
          {action === 'feed' ? '먹는 중…' : '먹이 주기'}
        </button>
        <button
          type="button"
          aria-pressed={action === 'sleep'}
          onClick={() => play(action === 'sleep' ? 'hello' : 'sleep')}
        >
          {action === 'sleep' ? '깨우기' : '낮잠 자기'}
        </button>
      </div>
      <p className={styles.hint}>이동 영역에 Tab으로 접근한 뒤 ← → 키로도 움직일 수 있어요.</p>
    </div>
  )
}
