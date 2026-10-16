import styles from './About.module.scss'

const About = () => {
  return (
    <div className={styles.about_container}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>CJE / FRONTEND PORTFOLIO</p>
        <h2 id="about-heading">ABOUT ME</h2>
        <div className={styles.profile}>
          <h3>
            사용자의 화면과
            <br />
            <span>데이터의 흐름을 잇습니다.</span>
          </h3>
          <div className={styles.info}>
            <p>프론트엔드 개발자 최정은입니다.</p>
            <p>
              React와 TypeScript로 사용자 화면을 만들고, Spring Boot와 MySQL로 입력부터 저장까지
              이어지는 흐름을 구현하고 있습니다.
            </p>
            <p>
              기능의 완성뿐 아니라 요청을 기다리는 순간, 실패했을 때의 안내, 다시 시도하는 과정까지
              생각합니다.
            </p>
          </div>
        </div>
        <ul className={styles.stack} aria-label="주요 사용 기술">
          {['React', 'TypeScript', 'Spring Boot', 'MySQL'].map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <div className={styles.profileActions}>
          <a className={styles.workLink} href="#projects">
            프로젝트 살펴보기 ↗
          </a>
          <a
            className={styles.workLink}
            href="https://github.com/CJE-cpu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 코드 보기 (새 탭)"
          >
            GitHub 코드 보기 ↗
          </a>
          <a className={styles.contactLink} href="#contact">
            채용 문의
          </a>
        </div>
      </div>
      <div className={styles.experienceNotes} aria-label="개발 경험과 작업 방식">
        <p className={styles.notesLabel}>HOW I BUILD / 개발 경험 노트</p>
        <article className={styles.experienceCard}>
          <span className={styles.noteNumber}>01 / INTERFACE</span>
          <h3>다음 행동이 보이는 화면</h3>
          <p>
            Studyroom의 가입·로그인 화면에 처리 상태와 오류 안내를 적용했습니다. 요청 중 중복 클릭을
            막고, 성공 후 이동과 헤더의 회원 표시를 연결했습니다.
          </p>
          <span className={styles.evidence}>React · TypeScript · TanStack Query</span>
        </article>
        <article className={styles.experienceCard}>
          <span className={styles.noteNumber}>02 / CONNECTION</span>
          <h3>화면에서 DB까지 이어지는 구현</h3>
          <p>
            Spring Boot API와 MySQL을 연결해 회원 정보를 저장하고, 비밀번호 해시와 세션 기반
            로그인·로그아웃을 구현했습니다.
          </p>
          <span className={styles.evidence}>Spring Boot · JPA · MySQL</span>
        </article>
        <article className={styles.experienceCard}>
          <span className={styles.noteNumber}>03 / VERIFICATION</span>
          <h3>실패하는 상황까지 확인하는 습관</h3>
          <p>
            H2 기반 테스트에서 중복 이메일, 잘못된 비밀번호, 로그아웃 후 회원 조회 거절을
            확인했습니다. 정상 동작과 예외 상황을 함께 검증합니다.
          </p>
          <span className={styles.evidence}>JUnit · API 통합 테스트</span>
        </article>
        <p className={styles.progressNote}>
          현재 Studyroom의 예약 기능을 서버·DB로 확장하는 작업을 진행하고 있습니다.
        </p>
      </div>
    </div>
  )
}

export default About
