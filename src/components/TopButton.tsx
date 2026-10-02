import styles from './TopButton.module.scss'
import MagneticBox from './MagneticBox'

const TopButton = () => {
  const handleScrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  return (
    <button type="button" className={styles.top} onClick={handleScrollToTop} aria-label="페이지 맨 위로 이동">
      <MagneticBox>
        <span className={styles.label}>TOP</span>
      </MagneticBox>
    </button>
  )
}

export default TopButton
