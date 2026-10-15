import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import styles from './About.module.scss'

type Tool = 'pencil' | 'highlighter'
type Point = { x: number; y: number }
type Stroke = { tool: Tool; points: Point[] }
const SIZE = 600

export default function DrawingNotebook() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokes = useRef<Stroke[]>([])
  const active = useRef<number | null>(null)
  const frame = useRef<number | null>(null)
  const [tool, setTool] = useState<Tool>('pencil')
  const [count, setCount] = useState(0)

  const paint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const ratio = canvas.width / SIZE
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)
    for (const stroke of strokes.current) {
      ctx.globalAlpha = stroke.tool === 'pencil' ? .9 : .3
      ctx.strokeStyle = ctx.fillStyle = stroke.tool === 'pencil' ? '#294763' : '#efbf24'
      ctx.lineWidth = stroke.tool === 'pencil' ? 3 : 24
      ctx.lineCap = ctx.lineJoin = 'round'
      ctx.beginPath()
      const first = stroke.points[0]
      if (stroke.points.length === 1) {
        ctx.arc(first.x, first.y, ctx.lineWidth / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.moveTo(first.x, first.y)
        for (const point of stroke.points.slice(1)) ctx.lineTo(point.x, point.y)
        // Render the complete stroke once so marker opacity does not accumulate per event.
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }

  const schedulePaint = () => {
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => { frame.current = null; paint() })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) canvas.width = canvas.height = SIZE * Math.min(window.devicePixelRatio || 1, 2)
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current) }
  }, [])

  const pointAt = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - bounds.left) / bounds.width * SIZE, y: (event.clientY - bounds.top) / bounds.height * SIZE }
  }
  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!event.isPrimary || event.button !== 0 || active.current !== null) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    active.current = event.pointerId
    strokes.current.push({ tool, points: [pointAt(event)] })
    setCount(strokes.current.length)
    schedulePaint()
  }
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (active.current !== event.pointerId) return
    strokes.current.at(-1)?.points.push(pointAt(event))
    schedulePaint()
  }
  const end = (event: PointerEvent<HTMLCanvasElement>) => {
    if (active.current !== event.pointerId) return
    if (event.type === 'pointerup') move(event)
    active.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  const edit = (clear: boolean) => {
    active.current = null
    if (clear) strokes.current = []
    else strokes.current.pop()
    setCount(strokes.current.length)
    schedulePaint()
  }

  return <div className={styles.canvas}>
    <div className={styles.notebook}>
      <img src="/images/about/drawing-notebook.png" alt="" draggable={false} />
      <canvas ref={canvasRef} className={styles.drawingSurface} width={600} height={600}
        aria-label="마우스나 터치로 자유롭게 그리는 노트" aria-describedby="drawing-help"
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} />
    </div>
    <p id="drawing-help" className={styles.drawingHelp}>도구를 선택하고 노트에 그려보세요. 그림은 이 화면에 머무는 동안 유지됩니다.</p>
    <div className={styles.drawingTools} role="group" aria-label="드로잉 도구">
      {(['pencil', 'highlighter'] as const).map(value => <button key={value} type="button"
        className={styles.drawingTool} aria-pressed={tool === value} onClick={() => setTool(value)}>
        <img src={`/images/tools/${value}.png`} alt="" width={128} height={128} draggable={false} />
        <span>{value === 'pencil' ? '연필' : '형광펜'}</span>
      </button>)}
    </div>
    <div className={styles.drawingActions}>
      <button type="button" disabled={!count} onClick={() => edit(false)}>되돌리기</button>
      <button type="button" disabled={!count} onClick={() => edit(true)}>모두 지우기</button>
    </div>
  </div>
}
