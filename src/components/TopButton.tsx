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
      <span className={styles.icon} aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h12M12 20V8m-5 5 5-5 5 5" />
        </svg>
      </span>
      <span className={styles.label}>TOP</span>
    </button>
  )
}

export default TopButton
