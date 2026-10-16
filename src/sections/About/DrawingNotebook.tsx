import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import styles from './About.module.scss'
import PaperFold from './PaperFold'

type Tool = 'pencil' | 'highlighter'
type Point = { x: number; y: number }
type Stroke = { tool: Tool; color: string; width: number; points: Point[] }
type Drawing = { strokes: Stroke[]; undo: Stroke[][]; redo: Stroke[][] }
const SIZE = 600
const KEY = 'cje-notebook-v2'
const COLORS = [
  { value: '#294763', name: '남색' },
  { value: '#efbf24', name: '노랑' },
  { value: '#64866e', name: '초록' },
]
let memory: Drawing | null = null

function readDrawing(): Drawing {
  if (memory) return memory
  let strokes: Stroke[] = []
  try {
    const raw: unknown = JSON.parse(sessionStorage.getItem(KEY) || '[]')
    if (
      Array.isArray(raw) &&
      raw.length <= 500 &&
      raw.every(
        (s) =>
          s &&
          ['pencil', 'highlighter'].includes(s.tool) &&
          COLORS.some((c) => c.value === s.color) &&
          [2, 4, 7, 12, 24, 36].includes(s.width) &&
          Array.isArray(s.points) &&
          s.points.length > 0 &&
          s.points.length <= 5000 &&
          s.points.every(
            (p: Point) =>
              p &&
              Number.isFinite(p.x) &&
              Number.isFinite(p.y) &&
              p.x >= 0 &&
              p.x <= SIZE &&
              p.y >= 0 &&
              p.y <= SIZE,
          ),
      )
    )
      strokes = raw
  } catch {
    /* Storage can be unavailable or contain invalid data. */
  }
  return { strokes, undo: [], redo: [] }
}

function draw(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const points = stroke.points
  if (!points.length) return
  ctx.save()
  ctx.globalAlpha = stroke.tool === 'pencil' ? 0.9 : 0.3
  ctx.strokeStyle = ctx.fillStyle = stroke.color
  ctx.lineWidth = stroke.width
  ctx.lineCap = ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  if (points.length === 1) {
    ctx.arc(points[0].x, points[0].y, stroke.width / 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    for (let i = 1; i < points.length - 1; i++) {
      const a = points[i],
        b = points[i + 1]
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2)
    }
    const last = points[points.length - 1]
    ctx.lineTo(last.x, last.y)
    ctx.stroke()
  }
  ctx.restore()
}

export default function DrawingNotebook() {
  const [foldSource, setFoldSource] = useState<HTMLCanvasElement | null>(null)
  const foldButton = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layer = useRef<HTMLCanvasElement | null>(null)
  const [initial] = useState(readDrawing)
  const model = useRef<Drawing>(initial)
  const draft = useRef<Stroke | null>(null)
  const active = useRef<number | null>(null)
  const frame = useRef<number | null>(null)
  const [tool, setTool] = useState<Tool>('pencil')
  const [color, setColor] = useState(COLORS[0].value)
  const [size, setSize] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [counts, setCounts] = useState(() => ({
    strokes: initial.strokes.length,
    undo: initial.undo.length,
    redo: initial.redo.length,
  }))
  const [notice, setNotice] = useState('')
  const [persistent, setPersistent] = useState(true)

  const paint = () => {
    const canvas = canvasRef.current,
      base = layer.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !base || !ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(base, 0, 0)
    ctx.setTransform(canvas.width / SIZE, 0, 0, canvas.height / SIZE, 0, 0)
    if (draft.current) draw(ctx, draft.current)
  }
  const rebuild = () => {
    const base = layer.current,
      ctx = base?.getContext('2d')
    if (!base || !ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, base.width, base.height)
    ctx.setTransform(base.width / SIZE, 0, 0, base.height / SIZE, 0, 0)
    model.current.strokes.forEach((s) => draw(ctx, s))
    paint()
  }
  const save = () => {
    memory = model.current
    try {
      sessionStorage.setItem(KEY, JSON.stringify(model.current.strokes))
      setPersistent(true)
    } catch {
      setPersistent(false)
    }
    setCounts({
      strokes: model.current.strokes.length,
      undo: model.current.undo.length,
      redo: model.current.redo.length,
    })
  }
  const schedulePaint = () => {
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      paint()
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.height = SIZE * Math.min(window.devicePixelRatio || 1, 2)
    layer.current = document.createElement('canvas')
    layer.current.width = layer.current.height = canvas.width
    rebuild()
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
      memory = model.current
    }
  }, [])

  const pointAt = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(SIZE, ((event.clientX - bounds.left) / bounds.width) * SIZE)),
      y: Math.max(0, Math.min(SIZE, ((event.clientY - bounds.top) / bounds.height) * SIZE)),
    }
  }
  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!enabled || !event.isPrimary || event.button !== 0 || active.current !== null) return
    if (model.current.strokes.length >= 500) {
      setNotice('획이 많아졌어요. PNG로 저장한 뒤 노트를 비워주세요.')
      return
    }
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    active.current = event.pointerId
    draft.current = {
      tool,
      color,
      width: (tool === 'pencil' ? [2, 4, 7] : [12, 24, 36])[size],
      points: [pointAt(event)],
    }
    setDrawing(true)
    setNotice('')
    schedulePaint()
  }
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    const stroke = draft.current
    if (active.current !== event.pointerId || !stroke) return
    const point = pointAt(event),
      last = stroke.points[stroke.points.length - 1]
    if (Math.hypot(point.x - last.x, point.y - last.y) >= 0.8 && stroke.points.length < 5000)
      stroke.points.push(point)
    schedulePaint()
  }
  const end = (event: PointerEvent<HTMLCanvasElement>) => {
    if (active.current !== event.pointerId) return
    if (event.type === 'pointerup') move(event)
    active.current = null
    const stroke = draft.current
    if (stroke) {
      const m = model.current
      m.undo = [...m.undo, m.strokes].slice(-30)
      m.redo = []
      m.strokes = [...m.strokes, stroke]
      const ctx = layer.current?.getContext('2d')
      if (ctx) draw(ctx, stroke)
      draft.current = null
      save()
    }
    setDrawing(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    schedulePaint()
  }
  const edit = (action: 'undo' | 'redo' | 'clear') => {
    if (active.current !== null) return
    const m = model.current
    if (action === 'clear') {
      if (!m.strokes.length) return
      m.undo = [...m.undo, m.strokes].slice(-30)
      m.redo = []
      m.strokes = []
    } else {
      const from = action === 'undo' ? m.undo : m.redo
      const to = action === 'undo' ? m.redo : m.undo
      const previous = from.pop()
      if (!previous) return
      to.push(m.strokes)
      m.strokes = previous
    }
    rebuild()
    save()
    setNotice(
      action === 'clear'
        ? '노트를 비웠어요. 되돌리기로 복구할 수 있어요.'
        : action === 'undo'
          ? '이전 상태로 되돌렸어요.'
          : '다시 적용했어요.',
    )
  }
  const download = () => {
    const base = layer.current
    if (!base) return
    const output = document.createElement('canvas')
    output.width = output.height = base.width
    const ctx = output.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#fff9e9'
    ctx.fillRect(0, 0, output.width, output.height)
    ctx.drawImage(base, 0, 0)
    output.toBlob((blob) => {
      if (!blob) {
        setNotice('이미지를 저장하지 못했어요. 다시 시도해주세요.')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'my-notebook.png'
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setNotice('아이보리 배경의 그림을 PNG로 저장했어요.')
    }, 'image/png')
  }

  return (
    <div className={styles.canvas}>
      {foldSource && (
        <PaperFold
          source={foldSource}
          onClose={() => {
            setFoldSource(null)
            requestAnimationFrame(() => foldButton.current?.focus())
          }}
        />
      )}
      <div hidden={!!foldSource}>
        <div className={styles.drawingActions}>
          <button
            ref={foldButton}
            type="button"
            disabled={drawing}
            onClick={() => {
              const source = layer.current
              if (!source) return
              const copy = document.createElement('canvas')
              copy.width = copy.height = source.width
              copy.getContext('2d')?.drawImage(source, 0, 0)
              setEnabled(false)
              setFoldSource(copy)
            }}
          >
            종이 접기 ↗
          </button>
          <button
            type="button"
            aria-pressed={enabled}
            disabled={drawing}
            onClick={() => setEnabled((v) => !v)}
          >
            {enabled ? '그리기 종료' : '그리기 시작'}
          </button>
          <span>{enabled ? '그리기 모드' : '스크롤 모드'}</span>
        </div>
        <div className={styles.notebook}>
          <img src="/images/about/drawing-notebook.png" alt="" draggable={false} />
          <canvas
            ref={canvasRef}
            className={styles.drawingSurface}
            width={600}
            height={600}
            style={{
              touchAction: enabled ? 'none' : 'pan-y',
              cursor: enabled ? 'crosshair' : 'auto',
            }}
            aria-label="마우스나 터치로 자유롭게 그리는 노트"
            aria-describedby="drawing-help"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            onLostPointerCapture={end}
          />
        </div>
        <p id="drawing-help" className={styles.drawingHelp}>
          {enabled
            ? '노트에 그려보세요. 화면을 스크롤하려면 그리기를 종료하세요.'
            : '그리기 시작을 누르면 노트에 그림을 그릴 수 있어요.'}
          <br />
          {persistent
            ? '완료한 그림은 같은 탭에서 새로고침하거나 책상을 둘러봐도 유지됩니다.'
            : '임시 저장 공간을 사용할 수 없어 새로고침하면 사라질 수 있어요. PNG로 저장해주세요.'}
        </p>
        <div className={styles.drawingTools} role="group" aria-label="드로잉 도구">
          {(['pencil', 'highlighter'] as const).map((value) => (
            <button
              key={value}
              type="button"
              disabled={drawing}
              className={styles.drawingTool}
              aria-pressed={tool === value}
              onClick={() => {
                setTool(value)
                setColor(value === 'pencil' ? COLORS[0].value : COLORS[1].value)
              }}
            >
              <img
                src={`/images/tools/${value}.png`}
                alt=""
                width={128}
                height={128}
                draggable={false}
              />
              <span>{value === 'pencil' ? '연필' : '형광펜'}</span>
            </button>
          ))}
        </div>
        <div className={styles.drawingOptions}>
          <label>
            굵기{' '}
            <select
              value={size}
              disabled={drawing}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={0}>얇게</option>
              <option value={1}>보통</option>
              <option value={2}>굵게</option>
            </select>
          </label>
          <div role="group" aria-label="그림 색상">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                disabled={drawing}
                aria-label={c.name}
                aria-pressed={color === c.value}
                title={c.name}
                style={{ backgroundColor: c.value }}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>
        </div>
        <div className={styles.drawingActions}>
          <button type="button" disabled={drawing || !counts.undo} onClick={() => edit('undo')}>
            되돌리기
          </button>
          <button type="button" disabled={drawing || !counts.redo} onClick={() => edit('redo')}>
            다시 실행
          </button>
          <button type="button" disabled={drawing || !counts.strokes} onClick={() => edit('clear')}>
            모두 지우기
          </button>
          <button type="button" disabled={drawing || !counts.strokes} onClick={download}>
            PNG 저장
          </button>
        </div>
        <p className={styles.drawingHelp} role="status">
          {notice}
        </p>
      </div>
    </div>
  )
}
