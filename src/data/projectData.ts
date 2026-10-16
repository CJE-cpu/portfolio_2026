type Project = {
  name: string
  img: string
  skill: string
  description: string
  team: number
  siteUrl?: string
  github : string
}

const projectData: Project[] = [
  {
    name: '게시글 작성',
    siteUrl: 'https://board-list-kappa.vercel.app/',
    img: '/images/projects/boardlist.png',
    skill: 'react, firebase',
    description: `서비스 소개
회원가입과 로그인 후 게시글을 작성할 수 있는 게시판 서비스입니다. React로 화면을 구성하고 Firebase를 활용했습니다.

구현 내용
회원가입·로그인 입력에 검증 규칙을 적용해 필수 정보와 입력 조건을 확인하도록 구성했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/board_list.git',
  },
  {
    name: '게시판',
    siteUrl: 'https://guestbook-evz9xl4mz-cje.vercel.app/',
    img: '/images/projects/guestbook.png',
    skill: 'react, firebase',
    description: `서비스 소개
사용자가 자신의 이야기를 남기고 관리할 수 있는 방명록 서비스입니다. React와 Firebase를 사용했습니다.

구현 내용
회원가입·로그인과 개인 프로필 설정을 제공하며, Firestore에 게시글을 저장하고 수정·삭제할 수 있도록 구성했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/guestbook.git',
  },
  {
    name: '쇼핑몰 웹사이트',
    siteUrl: 'https://shoppingmall-ochre.vercel.app/',
    img: '/images/projects/shoppingmall.png',
    skill: 'react, firebase',
    description: `서비스 소개
자동차 용품을 소개하는 쇼핑몰과 운영용 관리자 대시보드를 함께 구성한 개인 프로젝트입니다.

구현 내용
React와 Firebase를 활용해 상품을 살펴보는 화면을 만들었습니다. 관리자 계정으로 사용자 계정과 상품 정보를 관리하는 기능을 제공합니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/shoppingmall.git',
  },
  {
    name: 'gsapcodepen-ex',
    siteUrl: 'https://gsapcodepen-ex.vercel.app/',
    img: '/images/projects/gsapcodepen.png',
    skill: 'react, gsap',
    description: `프로젝트 소개
React 환경에서 GSAP을 활용한 웹 애니메이션을 구현한 실습 프로젝트입니다.

구현 내용
정적인 화면에 움직임을 더하는 표현을 다뤘습니다. 애니메이션 예제를 웹 화면에 적용하고 구현 결과를 살펴볼 수 있도록 구성했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/gsapcodepen_ex.git',
  },
  {
    name: '대시보드',
    siteUrl: 'https://dashboard-orcin-tau-75.vercel.app/',
    img: '/images/projects/dashboard.png',
    skill: 'nextjs',
    description: `프로젝트 소개
수치 데이터를 그래프로 살펴볼 수 있도록 만든 Next.js 기반 대시보드입니다.

구현 내용
Chart.js를 활용해 여러 형태의 차트를 한 화면에 구성했습니다. 데이터를 시각적인 형태로 표현하는 화면 구현을 다뤘습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/dashboard.git',
  },
  {
    name: '반려동물 용품 웹사이트',
    siteUrl: 'https://teamproject-eight.vercel.app/',
    img: '/images/projects/teamproject.png',
    skill: 'html, css, javascript',
    description: `서비스 소개
반려동물 용품을 소개하는 웹사이트 멍냥허브입니다. 3명이 함께 진행한 팀 프로젝트입니다.

팀 구현 내용
HTML, CSS, JavaScript를 활용해 페이지 구조와 스타일, 사용자 동작을 구현했습니다. 반려동물 용품을 소개하는 웹 화면을 구성했습니다.`,
    team: 3,
    github: 'https://github.com/CJE-cpu/teamproject.git',
  },
  {
    name: '여행 일정 추천 앱',
    siteUrl: 'https://lcode-jet.vercel.app/',
    img: '/images/projects/lcode.png',
    skill: 'react, firebase, OpenAI API',
    description: `서비스 소개
사용자가 여행 일정을 직접 구성하고 AI 추천을 참고할 수 있는 모바일 웹 서비스 L:CODE입니다.

팀 구현 내용
5명이 React와 Firebase를 활용해 개발했습니다. OpenAI API를 연동해 여행 일정을 추천받고 계획을 세울 때 참고할 수 있도록 구성했습니다.`,
    team: 5,
    github: 'https://github.com/CJE-cpu/LCODE.git',
  },
  {
    name: '스터디룸 예약 웹사이트',
    siteUrl: 'https://studyroom-coral.vercel.app/',
    img: '/images/projects/studyroom.png',
    skill: 'react, java, MYSQL',
    description: `서비스 소개 · 개발 중
React·TypeScript와 Spring Boot·MySQL로 공간 탐색부터 예약까지 연결하는 서비스를 개발하고 있습니다.

문제와 해결
중복 가입을 막기 위해 서버 입력 검증과 DB 이메일 중복 제약조건을 적용했습니다. 비밀번호는 PBKDF2 해시로 저장하고, 세션 기반 로그인·로그아웃과 회원 조회를 연결했습니다.

검증과 다음 단계
H2 기반 테스트로 가입·로그인·중복 이메일 거절과 로그아웃 후 인증 거절을 확인했습니다. 예약은 현재 브라우저 저장 방식이며, 서버·DB 연결을 진행할 예정입니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/studyroom.git',
  }
]

export default projectData
