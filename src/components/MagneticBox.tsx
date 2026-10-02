import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './Header.module.scss'

interface MagneticBoxProps {
  children: React.ReactNode
}

const MagneticBox = ({ children }: MagneticBoxProps) => {
  const ref = useRef<HTMLDivElement>(null)
  
  // 사각형 테두리가 이동할 X, Y 좌표값을 담을 모션 밸류
  const boxX = useMotionValue(0)
  const boxY = useMotionValue(0)

  // 테두리가 쫀득하게 따라오도록 스프링 애니메이션 물리 법칙 세팅
  const springConfig = { damping: 15, stiffness: 140, mass: 0.5 }
  const elasticX = useSpring(boxX, springConfig)
  const elasticY = useSpring(boxY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()

    // 사각형의 정중앙 중심점 계산
    const centerX = left + width / 2
    const centerY = top + height / 2

    // 마우스 커서와 사각형 중심점 사이의 물리적 거리 계산
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    // 💡 테두리 상자가 글자 영역 밖으로 너무 멀리 탈출하지 않도록 35%(* 0.35)로 가동 범위 제한
    boxX.set(distanceX * 0.35)
    boxY.set(distanceY * 0.35)
  }

  // 마우스가 영역을 벗어나면 제자리(0, 0)로 탄력 있게 컴백
  const handleMouseLeave = () => {
    boxX.set(0)
    boxY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={styles.magnetic_box_wrapper}
    >
      {/* 중앙 텍스트 (마그네틱 영향 안 받음) */}
      <span className={styles.magnetic_box_text}>{children}</span>

      {/* 🧲 자석처럼 포인터를 따라다니는 사각형 테두리 박스 */}
      <motion.div
        className={styles.magnetic_border_box}
        style={{
          x: elasticX,
          y: elasticY,
        }}
      />
    </div>
  )
}

export default MagneticBox
