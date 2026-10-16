import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import styles from './PaperFold.module.scss'

const instructions = [
  '윗모서리를 가운데로 접어요.',
  '가운데 선을 따라 몸통을 접어요.',
  '양쪽 날개를 펼쳐 비행기를 만들어요.',
]
export default function PaperFold({
  source,
  onClose,
}: {
  source: HTMLCanvasElement
  onClose: () => void
}) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<ReturnType<(typeof import('./paperScene'))['createPaperScene']> | null>(null)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [flying, setFlying] = useState(false)
  const [drag, setDrag] = useState(0)
  const pointer = useRef<{ id: number; x: number } | null>(null)
  const reduced = useReducedMotion()
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    close.current?.focus()
    let cancelled = false
    import('./paperScene')
      .then(({ createPaperScene }) => {
        if (cancelled || !host.current) return
        try {
          scene.current = createPaperScene(host.current, source)
          setStatus('ready')
        } catch {
          setStatus('error')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
      scene.current?.dispose()
      scene.current = null
    }
  }, [source])
  useEffect(() => {
    scene.current?.setStep(step, !!reduced)
  }, [step, reduced, status])
  const reset = () => {
    setFlying(false)
    setStep(0)
    scene.current?.setStep(0, !!reduced)
  }
  return (
    <section className={styles.fold} aria-label="종이비행기 접기">
      <div className={styles.top}>
        <span>FOLD YOUR IDEAS · {step} / 3</span>
        <button ref={close} type="button" onClick={onClose}>
          그림으로 돌아가기
        </button>
      </div>
      <div className={styles.stage}>
        <div ref={host} className={styles.scene} aria-hidden="true" />
        {status === 'loading' && <p className={styles.overlay}>종이를 꺼내고 있어요…</p>}
        {status === 'error' && (
          <p className={styles.overlay}>
            3D 화면을 열지 못했어요. 그림으로 돌아가 다시 시도해주세요.
          </p>
        )}
        {status === 'ready' && step < 3 && (
          <div className={styles.gesture}>
            <span className={styles.target} aria-hidden="true">
              접는 곳
            </span>
            <button
              type="button"
              className={styles.handle}
              aria-label="종이 모서리: 오른쪽으로 끌거나 클릭해 다음 단계 접기"
              style={{ transform: `translateX(${drag}px)` }}
              onPointerDown={(e) => {
                if (!e.isPrimary || e.button !== 0) return
                pointer.current = { id: e.pointerId, x: e.clientX }
                e.currentTarget.setPointerCapture(e.pointerId)
              }}
              onPointerMove={(e) => {
                if (pointer.current?.id === e.pointerId)
                  setDrag(Math.max(0, Math.min(130, e.clientX - pointer.current.x)))
              }}
              onPointerUp={(e) => {
                const start = pointer.current
                pointer.current = null
                setDrag(0)
                if (start?.id === e.pointerId && e.clientX - start.x > 70)
                  setStep((s) => Math.min(3, s + 1))
              }}
              onPointerCancel={() => {
                pointer.current = null
                setDrag(0)
              }}
              onLostPointerCapture={() => {
                pointer.current = null
                setDrag(0)
              }}
              onClick={(e) => {
                if (e.detail === 0) setStep((s) => Math.min(3, s + 1))
              }}
            >
              ↗
            </button>
            <span className={styles.dragHint}>모서리를 오른쪽 점선까지 끌어보세요</span>
          </div>
        )}
      </div>
      <p className={styles.instruction} role="status">
        {flying
          ? '생각이 날아오르는 순간. 다시 접어볼까요?'
          : step < 3
            ? instructions[step]
            : '나만의 종이비행기 완성! 이제 날려보세요.'}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          disabled={status !== 'ready' || step === 0 || flying}
          onClick={() => setStep((s) => s - 1)}
        >
          한 단계 펼치기
        </button>
        {step < 3 ? (
          <button
            type="button"
            disabled={status !== 'ready'}
            onClick={() => setStep((s) => Math.min(3, s + 1))}
          >
            다음 접기 →
          </button>
        ) : (
          <button
            type="button"
            disabled={flying}
            onClick={() => {
              setFlying(true)
              scene.current?.fly(!!reduced)
            }}
          >
            비행기 날리기 ↗
          </button>
        )}
        <button type="button" disabled={status !== 'ready'} onClick={reset}>
          처음으로
        </button>
      </div>
      <p className={styles.note}>그림은 그대로 보관돼요. 언제든 돌아가 이어 그릴 수 있어요.</p>
    </section>
  )
}
