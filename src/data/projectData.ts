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
    description: `로그인하여 간단한 게시글을 작성할 수 있는 react 프로젝트입니다.
    authStore.js에 회원가입과 로그인 규칙을 추가하여 조건을 만족해야만 로그인/회원가입이 가능하게 되어있습니다.`,
    team: 1,
  },
  {
    name: 'guestbook',
    siteUrl: 'https://guestbook-evz9xl4mz-cje.vercel.app/',
    img: '/images/projects/guestbook.png',
    skill: 'react, firebase',
    description: `firestore에 사용자 데이터(email, password)를 저장하여 회원가입, 로그인, 게시글 작성이 가능한 react 프로젝트입니다.
    사용자들은 개인 프로필 설정이 가능하고 작성한 게시글을 수정 또는 삭제할 수 있습니다.`,
    team: 1,
  },
  {
    name: 'shoppingmall',
    siteUrl: 'https://shoppingmall-ochre.vercel.app/',
    img: '/images/projects/shoppingmall.png',
    skill: 'react, firebase',
    description: `자동차 용품 판매 쇼핑몰
    admin 계정으로 dashboard에서 전체 계정과 상품을 관리할 수 있는 웹사이트입니다.`,
    team: 1,
  },
  {
    name: 'gsapcodepen-ex',
    siteUrl: 'https://gsapcodepen-ex.vercel.app/',
    img: '/images/projects/gsapcodepen.png',
    skill: 'react, gsap',
    description: 'gsap 라이브러리를 활용하여 역동적인 애니메이션을 구현한 프로젝트입니다.',
    team: 1,
  },
  {
    name: 'dashboard',
    siteUrl: 'https://dashboard-orcin-tau-75.vercel.app/',
    img: '/images/projects/dashboard.png',
    skill: 'nextjs',
    description: 'chart.js를 활용하여 여러가지 차트를 구현한 프로젝트입니다.',
    team: 1,
  },
  {
    name: '멍냥허브',
    siteUrl: 'https://teamproject-eight.vercel.app/',
    img: '/images/projects/teamproject.png',
    skill: 'html, css, javascript',
    description: `반려동물 용품 웹사이트입니다.`,
    team: 3,
  },
  {
    name: 'L:CODE',
    siteUrl: 'https://lcode-jet.vercel.app/',
    img: '/images/projects/lcode.png',
    skill: 'react, firebase, OpenAI API',
    description: `개인화 시대에 맞춰 여행 스케줄을 커스텀 할 수 있는 모바일 어플리케이션입니다.
    Open AI API를 활용하여 여행 일정을 추천받을 수 있습니다.`,
    team: 5,
  }
]

export default projectData
