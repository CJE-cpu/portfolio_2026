type Project = {
  name: string
  img: string
  skill: string
  description: string
  team: number
  siteUrl?: string
}

const projectData: Project[] = [
  {
    name: 'board-list',
    siteUrl: 'https://board-list-kappa.vercel.app/',
    img: '/images/projects/boardlist.png',
    skill: 'react, firebase',
    description: `React와 Firebase를 활용한 게시판 서비스입니다. 회원가입과 로그인 후 게시글을 작성할 수 있습니다.
회원가입·로그인 과정에 입력값 검증 규칙을 적용해, 정해진 조건에 맞는 정보를 입력하도록 구성했습니다.`,
    team: 1,
  },
  {
    name: 'guestbook',
    siteUrl: 'https://guestbook-evz9xl4mz-cje.vercel.app/',
    img: '/images/projects/guestbook.png',
    skill: 'react, firebase',
    description: `회원가입과 로그인 후 자신의 이야기를 남길 수 있는 방명록 서비스입니다. React로 화면을 구성하고 Firestore를 데이터 저장에 활용했습니다.
개인 프로필을 설정하고 게시글을 작성할 수 있으며, 작성한 글을 수정하거나 삭제하는 기능을 제공합니다.`,
    team: 1,
  },
  {
    name: 'shoppingmall',
    siteUrl: 'https://shoppingmall-ochre.vercel.app/',
    img: '/images/projects/shoppingmall.png',
    skill: 'react, firebase',
    description: `React와 Firebase로 제작한 자동차 용품 쇼핑몰입니다. 상품을 보여주는 쇼핑몰 화면과 운영을 위한 관리자 대시보드를 함께 구성했습니다.
관리자 계정으로 대시보드에 접속해 사용자 계정과 상품 정보를 관리할 수 있습니다.`,
    team: 1,
  },
  {
    name: 'gsapcodepen-ex',
    siteUrl: 'https://gsapcodepen-ex.vercel.app/',
    img: '/images/projects/gsapcodepen.png',
    skill: 'react, gsap',
    description: `React 환경에서 GSAP을 활용해 웹 애니메이션을 구현한 프로젝트입니다.
정적인 화면에 움직임을 더하는 표현을 다루며, 라이브러리를 활용한 애니메이션 구현 결과를 살펴볼 수 있습니다.`,
    team: 1,
  },
  {
    name: 'dashboard',
    siteUrl: 'https://dashboard-orcin-tau-75.vercel.app/',
    img: '/images/projects/dashboard.png',
    skill: 'nextjs',
    description: `Next.js와 Chart.js를 활용해 데이터를 시각화한 대시보드입니다.
여러 형태의 차트를 한 화면에 구성해, 수치 데이터를 그래프로 살펴볼 수 있도록 만들었습니다.`,
    team: 1,
  },
  {
    name: '멍냥허브',
    siteUrl: 'https://teamproject-eight.vercel.app/',
    img: '/images/projects/teamproject.png',
    skill: 'html, css, javascript',
    description: `반려동물 용품을 주제로 제작한 웹사이트입니다. HTML, CSS, JavaScript를 사용해 페이지 구조와 스타일, 동작을 구현했습니다.
3명이 함께 진행한 팀 프로젝트로, 반려동물 용품을 소개하는 웹 화면을 구성했습니다.`,
    team: 3,
  },
  {
    name: 'L:CODE',
    siteUrl: 'https://lcode-jet.vercel.app/',
    img: '/images/projects/lcode.png',
    skill: 'react, firebase, OpenAI API',
    description: `사용자가 여행 일정을 직접 구성할 수 있는 모바일 웹 기반 여행 계획 서비스입니다. React와 Firebase를 활용해 5명이 함께 제작했습니다.
OpenAI API를 연동해 여행 일정을 추천받는 기능을 제공하며, 여행 계획을 세울 때 참고할 수 있도록 구성했습니다.`,
    team: 5,
  }
]

export default projectData
