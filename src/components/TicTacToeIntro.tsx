import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { chooseMove, getWinningLine, type Mark } from '../utils/ticTacToe'
import styles from './TicTacToeIntro.module.scss'

export default function TicTacToeIntro({ onEnter }: { onEnter: () => void }) {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const reduceMotion = useReducedMotion()
  const winningLine = getWinningLine(board)
  const winner = winningLine ? board[winningLine[0]] : null
  const finished = Boolean(winner) || board.every(Boolean)

  useEffect(() => {
    if (turn !== 'O' || finished) return
    const timer = window.setTimeout(() => {
      const move = chooseMove(board)
      if (move !== undefined) {
        const next = [...board]
        next[move] = 'O'
        setBoard(next)
      }
      setTurn('X')
    }, 550)
    return () => window.clearTimeout(timer)
  }, [board, turn, finished])

  const play = (index: number) => {
    if (board[index] || turn !== 'X' || finished) return
    const next = [...board]
    next[index] = 'X'
    setBoard(next)
    setTurn('O')
  }

  const status = winner === 'X' ? '멋진 한 수! 당신이 이겼어요.'
    : winner === 'O' ? '이번 판은 제가 이겼어요. 한 판 더 할까요?'
    : finished ? '무승부! 좋은 승부였어요.'
    : turn === 'O' ? '제 차례예요. 잠시만 기다려주세요.'
    : '당신 차례예요. 빈 칸에 X를 놓아보세요.'

  return (
    <motion.main
      className={styles.intro}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      aria-labelledby="intro-title"
    >
      <header className={styles.header}>
        <a href="#top" onClick={onEnter}>CJE's Portfolio</a>
        <button type="button" onClick={onEnter}>인트로 건너뛰기 <span aria-hidden="true">↗</span></button>
      </header>

      <div className={styles.content}>
        <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className={styles.eyebrow}>A LITTLE PLAY, BEFORE WE BEGIN</p>
          <h1 id="intro-title">반가워요.<br />한 수 두고 <span>시작할까요?</span></h1>
          <p className={styles.description}>작은 움직임에도 즐거움을 담는<br />프론트엔드 개발자 최정은입니다.</p>
          <p className={styles.instruction}>가로, 세로, 대각선으로 세 칸을 이으면 승리!<br />저와 가볍게 한 판 즐겨보세요.</p>
          <button className={styles.enter} type="button" onClick={onEnter}>포트폴리오 보러 가기 <span aria-hidden="true">↗</span></button>
        </motion.div>

        <section className={styles.game} aria-label="컴퓨터와 틱택토 게임">
          <div className={styles.legend}><span><b>×</b> YOU</span><span><b>○</b> COMPUTER</span></div>
          <div className={styles.board}>
            {board.map((mark, index) => (
              <motion.button
                key={index} type="button"
                className={`${styles.cell} ${winningLine?.includes(index) ? styles.winning : ''}`}
                aria-label={`${Math.floor(index / 3) + 1}행 ${index % 3 + 1}열, ${mark ?? '빈 칸'}`}
                aria-disabled={Boolean(mark) || turn !== 'X' || finished}
                onClick={() => play(index)}
                whileHover={!reduceMotion && !mark && turn === 'X' && !finished ? { backgroundColor: '#edf4f7' } : undefined}
              >
                {mark && <motion.svg key={mark} viewBox="0 0 80 80" aria-hidden="true"
                  className={mark === 'X' ? styles.cross : styles.circle}
                  initial={{ scale: reduceMotion ? 1 : 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}>
                  {mark === 'X' ? <>
                    <motion.path d="M23 22L57 58" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} />
                    <motion.path d="M57 22L23 58" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduceMotion ? 0 : 0.1 }} />
                  </> : <motion.circle cx="40" cy="40" r="23" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />}
                </motion.svg>}
              </motion.button>
            ))}
          </div>
          <p className={styles.status} role="status" aria-live="polite">{status}</p>
          <button className={styles.restart} type="button" onClick={() => { setBoard(Array(9).fill(null)); setTurn('X') }}>다시 시작 ↺</button>
        </section>
      </div>
      <footer className={styles.footer}><span>THINK · BUILD · PLAY</span><span>게임은 선택이에요. 언제든 둘러보세요.</span></footer>
    </motion.main>
  )
}
