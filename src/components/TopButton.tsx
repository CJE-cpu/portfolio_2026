import styles from './TopButton.module.scss'

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
      <svg className={styles.coordinates} viewBox="0 0 40 36" fill="none" aria-hidden="true">
        <path className={styles.axis} d="M5 27H35M16 32V5" />
        <path className={styles.ticks} d="M8 25V29M24 25V29M32 25V29M14 19H18M14 11H18" />
        <path className={styles.arrow} d="M16 25V5M10 11L16 5L22 11" />
        <circle className={styles.origin} cx="16" cy="27" r="2.5" />
      </svg>
      <span className={styles.label}>TOP <span className={styles.coordinate} aria-hidden="true">(0)</span></span>
    </button>
  )
}

export default TopButton
