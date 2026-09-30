import { useEffect, useId, useState } from 'react'
import styles from './PenguinGame.module.scss'
import { createRandomTarget, MAX_COORDINATE } from '../utils/randomTarget'

const STAGE_COUNT = 3
const UNIT_SIZE = 52
const sx = (x: number) => 40 + x * UNIT_SIZE
const sy = (y: number) => 320 - y * UNIT_SIZE

const PenguinGame = () => {
  const id = useId()
  const [stage, setStage] = useState(0)
  const [slope, setSlope] = useState(0.5)
  const [height, setHeight] = useState(0)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'ready' | 'running' | 'success' | 'miss'>('ready')
  const [target, setTarget] = useState(() => createRandomTarget())

  useEffect(() => {
    if (status !== 'running') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let start: number | undefined
    const tick = (now: number) => {
      start ??= now
      const next = reduced ? 1 : Math.min((now - start) / 1600, 1)
      setProgress(next)
      if (next < 1) frame = requestAnimationFrame(tick)
      else setStatus(Math.abs(slope * target.x + height - target.y) < 0.05 ? 'success' : 'miss')
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [status, slope, height, target])

  const reset = () => { setProgress(0); setStatus('ready') }
  const nextStage = () => {
    setStage((stage + 1) % STAGE_COUNT)
    setTarget(createRandomTarget(target))
    setSlope(0.5)
    setHeight(0)
    reset()
  }
  const x = target.x * progress
  const message = status === 'running' ? '펭귄이 이동하고 있어요…'
    : status === 'success' ? '성공! 물고기를 만났어요.'
    : status === 'miss' ? '조금 빗나갔어요. 직선이 물고기를 지나도록 조절해 보세요.'
    : '파란 직선을 물고기에 맞추고 출발해 보세요.'

  return (
    <div className={styles.game}>
      <div className={styles.heading}><span>PLAY / 0{stage + 1}</span><span>COORDINATE CLUB</span></div>
      <h3>펭귄의 좌표 여행</h3>
      <p className={styles.help}>기울기와 높이를 바꿔 물고기 ({target.x}, {target.y})까지!</p>
      <svg className={styles.board} viewBox="0 0 360 360" role="img" aria-label={`목표 좌표 (${target.x}, ${target.y}), 펭귄 좌표 (${x.toFixed(1)}, ${(slope * x + height).toFixed(1)})`}>
        <defs><clipPath id={id}><rect x="20" y="8" width="325" height="338" /></clipPath></defs>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <path d={`M${sx(i)} 18V340M24 ${sy(i)}H336`} stroke="#2860b5" opacity=".1" />
            <text x={sx(i)} y="340" textAnchor="middle">{i}</text>
            {i > 0 && <text x="22" y={sy(i) + 4}>{i}</text>}
          </g>
        ))}
        <path d="M24 320H340M40 344V15" stroke="#859bb5" />
        <text x="340" y="340">x</text><text x="24" y="17">y</text>
        <g clipPath={`url(#${id})`}>
          <path d={`M${sx(0)} ${sy(height)}L${sx(MAX_COORDINATE)} ${sy(slope * MAX_COORDINATE + height)}`} stroke="#2860b5" strokeWidth="3" fill="none" />
          <g transform={`translate(${sx(target.x)}, ${sy(target.y)})`} opacity={status === 'success' ? 0.3 : 1}>
            <circle r="20" fill="#f5bd6230" />
            <image
              href="/images/game/fish.png"
              x="-24"
              y="-24"
              width="48"
              height="48"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
        <image
          href="/images/game/penguin.png"
          x={sx(x) - 28}
          y={sy(slope * x + height) - 52}
          width="56"
          height="56"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
      <div className={styles.formula}>y = {slope.toFixed(1)}x + {height.toFixed(1)}</div>
      <div className={styles.controls}>
        <label>기울기 a <output>{slope.toFixed(1)}</output>
          <input aria-label="기울기 a" type="range" min="0" max="1" step="0.1" value={slope} disabled={status === 'running'} onChange={e => { setSlope(Number(e.target.value)); reset() }} />
        </label>
        <label>높이 b <output>{height.toFixed(1)}</output>
          <input aria-label="높이 b" type="range" min="0" max="1" step="0.1" value={height} disabled={status === 'running'} onChange={e => { setHeight(Number(e.target.value)); reset() }} />
        </label>
      </div>
      <p className={styles.status} role="status">{message}</p>
      <div className={styles.actions}>
        {status === 'success' ? <button type="button" onClick={nextStage}>{stage === 2 ? '처음부터 다시' : '다음 단계'} →</button>
          : <button type="button" disabled={status === 'running'} onClick={() => { setProgress(0); setStatus('running') }}>{status === 'running' ? '이동 중…' : '출발 →'}</button>}
        <button type="button" className={styles.reset} onClick={() => { setSlope(0.5); setHeight(0); reset() }}>초기화</button>
      </div>
    </div>
  )
}
export default PenguinGame
