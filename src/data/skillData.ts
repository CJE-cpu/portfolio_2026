type SkillGroup = {
  group: 'frontend' | 'backend' | 'tools'
  category: string
  title: string
  label: string
  technologies: string[]
  description: string
  evidence: string
  icons?: string[]
}

const skillData: SkillGroup[] = [
  {
    category: 'FRONTEND',
    group: 'frontend',
    title: '사용자 흐름을 만드는 화면',
    label: '주력 기술',
    technologies: ['React', 'TypeScript'],
    description:
      '컴포넌트로 화면을 구성하고, API 요청 상태에 따라 로딩·오류·결과를 표시합니다. 회원가입부터 로그인 후 홈 이동까지 연결했습니다.',
    evidence: 'Studyroom · 회원가입·로그인 화면',
    icons: ['/images/skills/react.svg', '/images/skills/typescript.svg'],
  },
  {
    category: 'UI & INTERACTION',
    group: 'frontend',
    title: '주제에 맞는 화면과 움직임',
    label: '구현 경험',
    technologies: ['HTML', 'SCSS'],
    description:
      '종이 테마의 반응형 UI와 3D 책상, 프로젝트 페이지 넘김을 구현했습니다. 화면 크기와 움직임 감소 설정을 고려합니다.',
    evidence: '포트폴리오 · 3D 인트로·프로젝트 노트',
    icons: ['/images/skills/html.svg', '/images/skills/css.svg'],
  },
  {
    category: 'BACKEND',
    group: 'backend',
    title: '입력부터 저장까지 연결',
    label: '확장 중인 경험',
    technologies: ['Java', 'Spring Boot', 'MySQL'],
    description:
      '회원가입과 세션 기반 로그인·로그아웃 API를 구현했습니다. 비밀번호 해시 저장과 이메일 중복 검사를 적용하고 회원 DB를 연결했습니다.',
    evidence: 'Studyroom · 회원 API·DB',
  },
  {
    category: 'TEST & WORKFLOW',
    group: 'tools',
    title: '확인하고 기록하는 개발',
    label: '개발 도구',
    technologies: ['Git', 'GitHub'],
    description:
      'API의 정상 응답뿐 아니라 중복 가입, 잘못된 비밀번호, 로그아웃 후 인증 거절도 테스트합니다. 변경 사항을 커밋으로 기록하고 GitHub에 관리합니다.',
    evidence: 'Studyroom · H2 기반 API 통합 테스트',
  },
]

export default skillData
