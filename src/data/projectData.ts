type Project = {
  name: string
  img: string
  skill: string
  description: string
  team: number
  siteUrl?: string
  github: string
}

const projectData: Project[] = [
  {
    name: '게시판',
    siteUrl: 'https://board-list-kappa.vercel.app/',
    img: '/images/projects/boardlist.png',
    skill: 'react, firebase',
    description: `서비스 소개
회원가입과 로그인 후 자신의 글을 작성할 수 있는 게시판 서비스입니다.

구현 내용
React로 게시판 화면을 구성하고 Firebase를 연동했습니다. 회원가입·로그인 폼에서 필수 항목과 입력 조건을 확인해 잘못된 입력을 안내하도록 구현했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/board_list.git',
  },
  {
    name: '방명록',
    siteUrl: 'https://guestbook-evz9xl4mz-cje.vercel.app/',
    img: '/images/projects/guestbook.png',
    skill: 'react, firebase',
    description: `서비스 소개
방문자가 자신의 이야기를 남기고 프로필과 작성한 글을 관리할 수 있는 방명록 서비스입니다.

구현 내용
React와 Firebase로 회원가입·로그인 및 프로필 설정 기능을 구현했습니다. Firestore에 게시글을 저장하고 수정·삭제하는 흐름을 연결했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/guestbook.git',
  },
  {
    name: '쇼핑몰 웹사이트',
    siteUrl: 'https://shoppingmall-ochre.vercel.app/',
    img: '/images/projects/shoppingmall.png',
    skill: 'react, firebase',
    description: `서비스 소개
자동차 용품을 살펴보는 쇼핑몰과 운영자가 정보를 관리하는 대시보드를 함께 만든 서비스입니다.

구현 내용
React로 상품 탐색 화면을 구성하고 Firebase를 연동했습니다. 관리자 계정에서 사용자 계정과 상품 정보를 관리할 수 있도록 운영 화면을 구현했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/shoppingmall.git',
  },
  {
    name: 'gsapcodepen-ex',
    siteUrl: 'https://gsapcodepen-ex.vercel.app/',
    img: '/images/projects/gsapcodepen.png',
    skill: 'react, gsap',
    description: `프로젝트 소개
GSAP 애니메이션 예제를 React 화면에 적용하며 움직임을 실습한 프로젝트입니다.

구현 내용
예제의 애니메이션을 웹 화면으로 구성하고 실행 결과를 확인할 수 있도록 만들었습니다. 정적인 요소에 움직임을 적용하는 방법과 React 환경에서의 애니메이션 구현을 연습했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/gsapcodepen_ex.git',
  },
  {
    name: '대시보드',
    siteUrl: 'https://dashboard-orcin-tau-75.vercel.app/',
    img: '/images/projects/dashboard.png',
    skill: 'nextjs',
    description: `프로젝트 소개
수치 데이터를 여러 형태의 차트로 살펴볼 수 있는 Next.js 기반 대시보드입니다.

구현 내용
Chart.js로 데이터를 시각화하고 여러 차트를 한 화면에 배치했습니다. 숫자로 나열된 정보를 그래프로 표현해 항목별 데이터를 살펴볼 수 있도록 구성했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/dashboard.git',
  },
  {
    name: '반려동물 용품 웹사이트',
    siteUrl: 'https://teamproject-eight.vercel.app/',
    img: '/images/projects/teamproject.png',
    skill: 'html, css, javascript',
    description: `서비스 소개
반려동물 용품을 소개하는 웹사이트 ‘멍냥허브’입니다. 3명이 함께 페이지를 제작한 팀 프로젝트입니다.

팀 구현 내용
HTML로 페이지 구조를 만들고 CSS로 상품 소개 화면을 구성했습니다. JavaScript를 활용해 사용자 동작에 반응하는 기능을 더했습니다.`,
    team: 3,
    github: 'https://github.com/CJE-cpu/teamproject.git',
  },
  {
    name: '여행 일정 추천 앱',
    siteUrl: 'https://lcode-jet.vercel.app/',
    img: '/images/projects/lcode.png',
    skill: 'react, firebase, OpenAI API',
    description: `서비스 소개
여행 일정을 직접 구성하면서 AI 추천을 참고할 수 있는 모바일 웹 서비스 ‘L:CODE’입니다.

팀 구현 내용
5명이 React와 Firebase를 활용해 개발했습니다. OpenAI API를 연동해 여행 일정 추천을 제공하고, 사용자가 자신의 여행 계획을 구성할 때 참고할 수 있도록 연결했습니다.`,
    team: 5,
    github: 'https://github.com/CJE-cpu/LCODE.git',
  },
  {
    name: '스터디룸 예약 웹사이트',
    siteUrl: 'https://studyroom-pt9j.onrender.com',
    img: '/images/projects/studyroom.png',
    skill: 'React, TypeScript, Spring Boot, MySQL',
    description: `서비스 소개 · 개발 중
공간을 탐색하고 날짜와 시간을 선택해 예약하는 서비스입니다. React·TypeScript 프론트엔드와 Spring Boot·MySQL 백엔드를 연결했습니다.

구현 내용
세션 기반 로그인, 예약 생성·조회·취소를 구현했습니다. 비밀번호는 PBKDF2 해시로 저장하며, 예약 인원과 시간을 검증하고 본인 예약만 취소할 수 있도록 처리했습니다.

문제 해결과 검증
같은 공간·시간의 중복 예약을 막기 위해 서버 검증과 DB 고유 제약조건을 적용했습니다. 로컬 서버에서 로그인·예약·취소 흐름과 중복 예약·다른 사용자 예약 취소 거절을 확인했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/studyroom.git',
  },
  {
    name: '펭귄 게임 웹사이트',
    siteUrl: 'https://web-puce-tau-33.vercel.app/',
    img: '/images/projects/penguingame.png',
    skill: 'react, python',
    description: `서비스 소개
로그인 후 펭귄 게임을 즐기고, 게임을 완료하면 플레이 기록을 남길 수 있는 웹사이트입니다.

구현 내용
React와 Python을 사용한 개인 프로젝트입니다. 로그인부터 게임 플레이, 완료 후 기록 저장까지 이어지는 흐름으로 구성했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/penguingame.git',
  },
  {
    name: 'AI 챗봇',
    siteUrl: 'https://nextjschatbot-zeta.vercel.app/',
    img: '/images/projects/chatbot.png',
    skill: 'nextJS',
    description: `서비스 소개
로그인 후 펭귄 게임을 즐기고, 게임을 완료하면 플레이 기록을 남길 수 있는 웹사이트입니다.

구현 내용
React와 Python을 사용한 개인 프로젝트입니다. 로그인부터 게임 플레이, 완료 후 기록 저장까지 이어지는 흐름으로 구성했습니다.`,
    team: 1,
    github: 'https://github.com/CJE-cpu/nextJS_chatbot.git',
  },
]

export default projectData
