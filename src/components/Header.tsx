import styles from './Header.module.scss'

import { useLayoutEffect, useRef } from 'react'
import MagneticBox from './MagneticBox'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger) 

const Header = () => {
  const headerRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    const app = header?.parentElement
    const progressBar = progressBarRef.current
    
    if (!header || !app || !progressBar) return

    // 헤더 높이 계산 로직
    const updateHeight = () => {
      app.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)

    // 독립된 이미지 컨테이너 탐색
    const progressThumb = progressBar.parentElement?.querySelector(`.${styles.progress_thumb}`)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    })

    // 1. 프로그레스 바 가로 스케일 애니메이션
    tl.to(progressBar, {
      scaleX: 1,
      ease: 'none'
    }, 0)

    // 2. 이미지는 찌그러짐이 발생하지 않도록 left 속성을 활용해 0%에서 100%로 수평 이동시킵니다.
    if (progressThumb) {
      tl.to(progressThumb, {
        left: '100%',
        ease: 'none'
      }, 0)
    }

    // 클린업
    return () => {
      observer.disconnect()
      app.style.removeProperty('--header-height')
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={`layout ${styles.inner}`}>
        <h1 className={styles.logo}><a href="#top">CJE's Portfolio</a></h1>
        <nav className={styles.nav} aria-label="주 메뉴">
          <a href="#about"><MagneticBox>about</MagneticBox></a>
          <a href="#skills"><MagneticBox>skills</MagneticBox></a>
          <a href="#projects"><MagneticBox>projects</MagneticBox></a>
          <a href="#contact"><MagneticBox>contact</MagneticBox></a>
        </nav>
      </div>
      <div className={styles.progress_container}>
        <div ref={progressBarRef} className={styles.progressbar}></div>
        <div className={styles.progress_thumb}>
          <img src='/images/progress/penguin-slide.png' alt="Progress Icon" />
        </div>
      </div>
    </header>
  )
}

export default Header
