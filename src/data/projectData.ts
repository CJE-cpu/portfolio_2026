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
    skill: '',
    description: '',
    team: 0,
  },
  {
    name: 'guestbook',
    siteUrl: 'https://guestbook-evz9xl4mz-cje.vercel.app/',
    img: '/images/projects/guestbook.png',
    skill: '',
    description: '',
    team: 0,
  },
  {
    name: 'shoppingmall',
    siteUrl: 'https://shoppingmall-ochre.vercel.app/',
    img: '/images/projects/shoppingmall.png',
    skill: '',
    description: '',
    team: 0,
  },
  {
    name: 'gsapcodepen-ex',
    siteUrl: 'https://gsapcodepen-ex.vercel.app/',
    img: '/images/projects/gsapcodepen.png',
    skill: '',
    description: '',
    team: 0,
  },
  {
    name: 'dashboard',
    siteUrl: 'https://dashboard-orcin-tau-75.vercel.app/',
    img: '',
    skill: '',
    description: '',
    team: 0,
  },
]

export default projectData
