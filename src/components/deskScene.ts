import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createPaperGeometry, createShadeGeometry } from './deskGeometry'
import { createRoomTexture } from './deskTextures'

export type DeskItem = 'book' | 'note' | 'mug' | 'lamp' | 'postit'
export type DeskView = 'front' | 'top' | 'angle'

export function createDeskScene(host: HTMLElement, onPick: (id: DeskItem) => void, onHover: (id: DeskItem | null) => void, onLamp: (on: boolean) => void) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0x000000, 0)
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  // A neutral studio reflection gives ceramic and metal visible surface highlights.
  const environmentScene = new RoomEnvironment()
  const environmentGenerator = new THREE.PMREMGenerator(renderer)
  const environment = environmentGenerator.fromScene(environmentScene, .06)
  scene.environment = environment.texture
  scene.environmentIntensity = .22
  environmentScene.dispose(); environmentGenerator.dispose()
  scene.background = new THREE.Color(0x626e78)
  scene.fog = new THREE.Fog(0x626e78, 30, 65)
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100)
  const materials: THREE.Material[] = []
  const textures: THREE.Texture[] = []
  const mat = (color: number, roughness = .8) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness })
    materials.push(m)
    return m
  }
  const cream = mat(0xfff9e9), blue = mat(0x376797), wood = mat(0xd9b48c), dark = mat(0x334a51), brass = mat(0xb39355, .35)
  // Procedural surface maps stay local and require no external image downloads.
  const surface = (kind: 'wood' | 'paper') => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512
    const ctx = canvas.getContext('2d')!
    const pixels = ctx.createImageData(512, 512)
    let seed = 47
    for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const noise = seed / 4294967296
      const grain = Math.sin(y * .64 + Math.sin(x * .025) * 2.2 + Math.sin(x * .006) * 4)
      const fineGrain = Math.sin(y * 2.7 + Math.sin(x * .014) * 5)
      const value = kind === 'wood' ? 224 + grain * 10 + fineGrain * 4 + noise * 7 : 239 + noise * 16
      const index = (y * 512 + x) * 4
      pixels.data[index] = value; pixels.data[index + 1] = value; pixels.data[index + 2] = value; pixels.data[index + 3] = 255
    }
    ctx.putImageData(pixels, 0, 0)
    if (kind === 'wood') {
      ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = .6
      for (let i = 0; i < 9; i++) {
        const x = 37 + i * 49, y = 43 + (i * 71) % 410
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 18, y + 1); ctx.stroke()
      }
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    textures.push(texture)
    return texture
  }
  const woodSurface = surface('wood'), paperSurface = surface('paper')
  wood.bumpMap = woodSurface; wood.bumpScale = .012; wood.roughnessMap = woodSurface; wood.roughness = .58
  const woodColor = woodSurface.clone(); woodColor.colorSpace = THREE.SRGBColorSpace; woodColor.needsUpdate = true; textures.push(woodColor); wood.map = woodColor
  cream.bumpMap = paperSurface; cream.bumpScale = .009
  blue.bumpMap = paperSurface; blue.bumpScale = .006; blue.roughness = .7
  const mesh = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geometry, material)
    m.position.set(x, y, z)
    m.castShadow = true
    m.receiveShadow = true
    parent.add(m)
    return m
  }
  const box = (parent: THREE.Object3D, w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) => mesh(parent, new RoundedBoxGeometry(w, h, d, 3, Math.min(.06, h / 3)), material, x, y, z)
  const cylinder = (parent: THREE.Object3D, r: number, h: number, material: THREE.Material, x = 0, y = 0, z = 0) => mesh(parent, new THREE.CylinderGeometry(r, r, h, 40), material, x, y, z)
  const tube = (parent: THREE.Object3D, points: number[][], radius: number, material: THREE.Material) =>
    mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z))), 28, radius, 8, false), material)
  const pageEdge = mat(0xd3c7ad), silver = mat(0xbac3c4, .3), coral = mat(0xc8694b)
  silver.metalness = .65; brass.metalness = .5
  const label = (parent: THREE.Object3D, title: string, subtitle: string, w: number, d: number, x: number, y: number, z: number, background: string, grid = false) => {
    const canvas = document.createElement('canvas')
    canvas.width = 768; canvas.height = 768
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = background; ctx.fillRect(0, 0, 768, 768)
    if (grid) {
      ctx.strokeStyle = '#d2dce1'; ctx.lineWidth = 1
      for (let n = 32; n < 768; n += 32) { ctx.beginPath(); ctx.moveTo(n, 0); ctx.lineTo(n, 768); ctx.moveTo(0, n); ctx.lineTo(768, n); ctx.stroke() }
    }
    ctx.fillStyle = background === '#376797' ? '#fff9e9' : '#294763'
    const ink = ctx.fillStyle
    ctx.textAlign = 'center'
    const lines = title.split('\n')
    let fontSize = lines.length > 1 ? 166 : 140
    ctx.font = `900 ${fontSize}px sans-serif`
    while (lines.some(line => ctx.measureText(line).width > 660)) {
      fontSize -= 2
      ctx.font = `900 ${fontSize}px sans-serif`
    }
    lines.forEach((line, index) => ctx.fillText(line, 384, 165 + index * (fontSize + 12)))
    // Bold printed pictograms remain recognizable from the overview camera.
    ctx.strokeStyle = ink; ctx.lineWidth = 17; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    if (title.includes('PROJECT')) {
      ctx.strokeRect(140, 430, 488, 190)
      ctx.beginPath(); ctx.moveTo(140, 479); ctx.lineTo(628, 479); ctx.stroke()
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(170 + i * 32, 456, 7, 0, Math.PI * 2); ctx.fill() }
      ctx.font = '900 100px monospace'; ctx.fillText('</>', 384, 589)
    } else if (title.includes('ABOUT')) {
      ctx.beginPath(); ctx.arc(384, 462, 54, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(384, 616, 94, Math.PI, Math.PI * 2); ctx.stroke()
    } else if (title.includes('HELLO')) {
      ctx.strokeRect(166, 425, 436, 195)
      ctx.beginPath(); ctx.moveTo(166, 425); ctx.lineTo(384, 551); ctx.lineTo(602, 425); ctx.stroke()
    } else {
      ctx.font = '900 210px monospace'; ctx.fillText(title === 'LIGHT' ? '○' : '</>', 384, 510)
    }
    ctx.font = 'bold 40px monospace'
    ctx.fillText(subtitle, 384, 710, 660)
    // Light edge scuffs leave the main titles intact.
    ctx.strokeStyle = background === '#376797' ? 'rgba(255,249,233,.2)' : 'rgba(119,96,60,.1)'
    ctx.lineWidth = 2
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(12 + i * 8, 740 - i * 2); ctx.lineTo(35 + i * 8, 737 - i * 2); ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); textures.push(texture)
    // Printed surfaces now receive natural light, with fine paper relief.
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: .9, bumpMap: paperSurface, bumpScale: .005 }); materials.push(material)
    const plane = mesh(parent, new THREE.PlaneGeometry(w, d), material, x, y, z)
    plane.rotation.x = -Math.PI / 2
    plane.castShadow = false
    return plane
  }
  const table = new THREE.Group(); scene.add(table)
  box(table, 8.8, .28, 5.4, wood, 0, -.17)
  for (const x of [-3.8, 3.8]) for (const z of [-2, 2]) box(table, .24, 2.5, .24, dark, x, -1.55, z)
  box(table, 7.6, .32, .13, wood, 0, -.46, -2.1)
  for (const x of [-3.8, 3.8]) box(table, .35, .12, .35, dark, x, -2.76, 2)
  // Fine grooves and a desk mat give the table a tangible surface.
  const grain = mat(0xc19c76)
  for (const z of [-.9, .9]) box(table, 8.5, .002, .007, grain, 0, -.028, z)
  box(table, 5.9, .025, 3.55, mat(0xe4e5d9), -.2, .005, .3)
  const groups = new Map<DeskItem, THREE.Group>()
  const group = (id: DeskItem, x: number, z: number, rotation = 0) => {
    const g = new THREE.Group(); g.position.set(x, .04, z); g.rotation.y = rotation; g.userData.id = id; scene.add(g); groups.set(id, g); return g
  }
  const book = group('book', -2.5, -.35, -.18)
  box(book, 1.6, .08, 2.05, blue, 0, .04)
  box(book, 1.49, .25, 1.94, cream, .025, .205)
  box(book, 1.6, .08, 2.05, blue, 0, .37)
  box(book, .12, .36, 2.05, blue, -.76, .2)
  label(book, 'PROJECTS', 'SELECTED WORK / CJE', 1.43, 1.9, .04, .412, 0, '#376797')
  box(book, .13, .012, .48, mat(0xc8694b), .45, .09, 1.05)
  // Thin edge lines suggest layered pages rather than a solid block.
  for (let i = 0; i < 9; i++) {
    const y = .105 + i * .024
    box(book, 1.47, .005, .006, pageEdge, .025, y, .972)
    box(book, .006, .005, 1.92, pageEdge, .774, y)
  }
  for (const z of [-.73, .73]) box(book, .014, .26, .045, brass, -.824, .2, z)
  tube(book, [[.45, .095, 1.03], [.45, .08, 1.17], [.46, .025, 1.25]], .035, coral)

  const note = group('note', -.05, .55, .1)
  box(note, 2.35, .065, 1.95, dark, 0, .04)
  box(note, 2.24, .06, 1.84, cream, 0, .105)
  const notePage = label(note, 'ABOUT\nME', 'THINK. BUILD. PLAY.', 2.2, 1.8, 0, .138, 0, '#fff9e9', true)
  notePage.geometry.dispose(); notePage.geometry = createPaperGeometry(2.2, 1.8, .095)
  const notePaper = notePage.material as THREE.MeshStandardMaterial
  notePaper.side = THREE.DoubleSide; notePage.castShadow = true
  for (let i = 0; i < 8; i++) {
    const ring = mesh(note, new THREE.TorusGeometry(.085, .018, 8, 20), brass, -1.13, .15, -.72 + i * .2)
    ring.rotation.y = Math.PI / 2
  }
  for (let i = 0; i < 3; i++) box(note, 2.22, .003, .006, pageEdge, 0, .088 + i * .016, .923)
  for (let i = 0; i < 2; i++) box(note, .2, .018, .24, i ? coral : blue, 1.16, .1, -.5 + i * .38)
  const pencil = new THREE.Group(); pencil.position.set(1.02, .2, .12); pencil.rotation.y = -.12; note.add(pencil)
  const barrel = mesh(pencil, new THREE.CylinderGeometry(.04, .04, 1.15, 6), blue); barrel.rotation.x = Math.PI / 2
  const tip = mesh(pencil, new THREE.ConeGeometry(.04, .17, 6), wood, 0, 0, -.66); tip.rotation.x = -Math.PI / 2
  const graphite = mesh(pencil, new THREE.ConeGeometry(.013, .05, 6), dark, 0, 0, -.755); graphite.rotation.x = -Math.PI / 2
  const ferrule = cylinder(pencil, .043, .1, silver, 0, 0, .59); ferrule.rotation.x = Math.PI / 2
  const eraser = cylinder(pencil, .041, .13, coral, 0, 0, .7); eraser.rotation.x = Math.PI / 2

  const mug = group('mug', 2.8, .85, .3)
  const saucerProfile = [[0, .025], [.43, .025], [.58, .035], [.65, .065], [.66, .085], [.64, .098], [.59, .077], [.45, .06], [0, .06]].map(([r, y]) => new THREE.Vector2(r, y))
  mesh(mug, new THREE.LatheGeometry(saucerProfile, 64), cream)
  const profile = [[0, .075], [.3, .075], [.35, .08], [.385, .095], [.4, .12], [.44, .78], [.434, .804], [.415, .816], [.393, .807], [.38, .78], [.34, .18], [.31, .15], [0, .15]].map(([x, y]) => new THREE.Vector2(x, y))
  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0x376797, roughness: .22, clearcoat: .65, clearcoatRoughness: .16 })
  materials.push(ceramic)
  mesh(mug, new THREE.LatheGeometry(profile, 64), ceramic)
  cylinder(mug, .36, .02, mat(0x4a3022), 0, .68)
  tube(mug, [[.4, .66, 0], [.65, .7, 0], [.79, .55, 0], [.76, .32, 0], [.57, .22, 0], [.4, .25, 0]], .065, ceramic)
  for (const y of [.25, .66]) {
    const joint = mesh(mug, new THREE.SphereGeometry(.1, 20, 12), ceramic, .405, y)
    joint.scale.set(.8, 1, .85)
  }
  const rim = mesh(mug, new THREE.TorusGeometry(.398, .028, 10, 48), cream, 0, .792); rim.rotation.x = Math.PI / 2
  const crema = mesh(mug, new THREE.TorusGeometry(.32, .012, 8, 40), mat(0xa47c50), 0, .693); crema.rotation.x = Math.PI / 2
  const saucerRim = mesh(mug, new THREE.TorusGeometry(.6, .018, 8, 40), pageEdge, 0, .082); saucerRim.rotation.x = Math.PI / 2
  const stainMaterial = new THREE.MeshStandardMaterial({ color: 0x876346, transparent: true, opacity: .16, roughness: .9, depthWrite: false })
  materials.push(stainMaterial)
  const stain = mesh(mug, new THREE.RingGeometry(.47, .485, 48, 1, .2, Math.PI * 1.4), stainMaterial, 0, .078)
  stain.rotation.x = -Math.PI / 2; stain.castShadow = false
  const mugPrint = label(mug, 'SKILLS', 'CODE & COFFEE', .62, .51, 0, .42, .445, '#376797')
  // A curved decal follows the exact taper of the cup, with only a tiny offset.
  mugPrint.geometry.dispose()
  mugPrint.geometry = new THREE.CylinderGeometry(.432, .406, .43, 48, 1, true, -.9, 1.8)
  mugPrint.position.set(0, .43, 0)
  mugPrint.rotation.x = 0
  const printMaterial = mugPrint.material as THREE.MeshStandardMaterial
  printMaterial.roughness = .24; printMaterial.bumpScale = 0

  const lamp = group('lamp', 2.8, -1.65)
  cylinder(lamp, .57, .12, dark, 0, .08)
  label(lamp, 'LIGHT', 'ON / OFF', .64, .55, 0, .145, .18, '#fff9e9')
  cylinder(lamp, .055, 1.7, brass, 0, .95)
  // Join the two pivots exactly, so the arm no longer floats past the joints.
  const armStart = new THREE.Vector3(0, 1.7, 0), armEnd = new THREE.Vector3(-.65, 1.96, 0)
  const armVector = armEnd.clone().sub(armStart)
  const arm = cylinder(lamp, .055, armVector.length(), brass)
  arm.position.copy(armStart).add(armEnd).multiplyScalar(.5)
  arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), armVector.normalize())
  for (const [x, y] of [[0, 1.7], [-.65, 1.96]]) {
    mesh(lamp, new THREE.SphereGeometry(.105, 16, 12), dark, x, y)
    const bolt = cylinder(lamp, .055, .22, brass, x, y); bolt.rotation.x = Math.PI / 2
  }
  const shadeRim = mesh(lamp, new THREE.TorusGeometry(.62, .025, 10, 48), brass, -.65, 1.58); shadeRim.rotation.x = Math.PI / 2
  const powerSwitch = box(lamp, .14, .06, .2, coral, .32, .165, -.15)
  tube(lamp, [[0, .07, -.45], [-.1, .01, -.65], [-.8, 0, -.75], [-1.15, -.08, -.98], [-1.15, -.85, -1.13]], .025, dark)
  mesh(lamp, createShadeGeometry(), mat(0x537575, .32), -.65, 1.58)
  cylinder(lamp, .105, .18, cream, -.65, 1.92)
  const bulbMat = mat(0xffe9b1); bulbMat.emissive.set(0xffc477); bulbMat.emissiveIntensity = 2.5
  mesh(lamp, new THREE.SphereGeometry(.16, 16, 12), bulbMat, -.65, 1.62)
  // Place the source below the bulb and shade so neither blocks the desk beam.
  const lampIntensity = 32
  const light = new THREE.SpotLight(0xffc477, lampIntensity, 7, .95, .65, 2)
  light.position.set(-.65, 1.42, 0)
  light.target.position.set(-1.4, 0, 1.4)
  light.castShadow = true
  light.shadow.mapSize.set(1024, 1024)
  light.shadow.camera.near = .1; light.shadow.camera.far = 7
  light.shadow.bias = -.0001; light.shadow.normalBias = .015
  lamp.add(light, light.target)

  const postit = group('postit', .1, -1.6, -.12)
  box(postit, 1.28, .05, 1.04, mat(0xf2d67f), 0, .04)
  for (let i = 0; i < 3; i++) box(postit, 1.28, .003, .006, pageEdge, 0, .025 + i * .012, .522)
  const tapeMaterial = new THREE.MeshStandardMaterial({ color: 0xfff4d8, transparent: true, opacity: .65, roughness: 1 })
  materials.push(tapeMaterial)
  const tape = box(postit, .5, .007, .16, tapeMaterial, 0, .074, -.45); tape.rotation.y = .12
  const stickyPage = label(postit, 'SAY\nHELLO', 'CONTACT ME', 1.26, 1.02, 0, .067, 0, '#f2d67f')
  stickyPage.geometry.dispose(); stickyPage.geometry = createPaperGeometry(1.26, 1.02, .16)
  const stickyPaper = stickyPage.material as THREE.MeshStandardMaterial
  stickyPaper.side = THREE.DoubleSide; stickyPage.castShadow = true
  // Each surface owns its repeat scale; never change maps shared by desk objects.
  const roomSurface = (material: THREE.MeshStandardMaterial, source: THREE.Texture, repeatX: number, repeatY: number, relief: number) => {
    const bump = source.clone()
    bump.repeat.set(repeatX, repeatY)
    bump.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    bump.needsUpdate = true
    const color = bump.clone(); color.colorSpace = THREE.SRGBColorSpace; color.needsUpdate = true
    textures.push(bump, color)
    material.map = color; material.bumpMap = bump; material.bumpScale = relief
    material.roughnessMap = bump
  }
  const plasterTexture = createRoomTexture('plaster'), clayTexture = createRoomTexture('clay')
  const soilTexture = createRoomTexture('soil'), leafTexture = createRoomTexture('leaf')
  textures.push(plasterTexture, clayTexture, soilTexture, leafTexture)
  const floorMaterial = mat(0x7c7a73, .82)
  roomSurface(floorMaterial, woodSurface, 40, 140, .018)
  const floor = mesh(scene, new THREE.PlaneGeometry(200, 200), floorMaterial, 0, -2.83); floor.rotation.x = -Math.PI / 2
  // A quiet studio surrounds the desk: plaster wall, window, skirting and a plant.
  const room = new THREE.Group(); scene.add(room)
  const plaster = mat(0x73808a), trim = mat(0xa4abaa)
  roomSurface(plaster, plasterTexture, 30, 8, .018)
  roomSurface(trim, woodSurface, 2, 3, .008)
  box(room, 60, 16, .2, plaster, 0, 5, -5.8)
  box(room, 60, .18, .12, trim, 0, -2.65, -5.65)
  // Painted frames use a separate material from the wooden room trim.
  const windowFrame = mat(0xc1c6c1, .48)
  windowFrame.metalness = .08
  const skyCanvas = document.createElement('canvas')
  skyCanvas.width = 16; skyCanvas.height = 256
  const skyContext = skyCanvas.getContext('2d')!
  const skyGradient = skyContext.createLinearGradient(0, 0, 0, 256)
  skyGradient.addColorStop(0, '#718caa')
  skyGradient.addColorStop(.6, '#a4b8c4')
  skyGradient.addColorStop(1, '#d1d4cc')
  skyContext.fillStyle = skyGradient; skyContext.fillRect(0, 0, 16, 256)
  const skyMap = new THREE.CanvasTexture(skyCanvas)
  skyMap.colorSpace = THREE.SRGBColorSpace; textures.push(skyMap)
  const sky = mat(0xffffff, 1)
  sky.map = skyMap; sky.emissive.set(0xffffff); sky.emissiveMap = skyMap; sky.emissiveIntensity = .18
  box(room, 4.4, 4.6, .12, windowFrame, -4.8, 2.4, -5.59)
  box(room, 4.05, 4.25, .04, sky, -4.8, 2.4, -5.5)
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xdbeaf0, metalness: 0, roughness: .16,
    transparent: true, opacity: .23, depthWrite: false,
    clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: .85,
  })
  materials.push(glass)
  for (const x of [-5.8375, -3.7625]) for (const y of [1.3125, 3.4875]) {
    const pane = mesh(room, new THREE.PlaneGeometry(1.975, 2.075), glass, x, y, -5.455)
    pane.castShadow = false
  }
  box(room, .1, 4.3, .18, windowFrame, -4.8, 2.4, -5.4)
  box(room, 4.1, .1, .18, windowFrame, -4.8, 2.4, -5.4)
  box(room, 4.65, .14, .65, windowFrame, -4.8, .1, -5.3)
  // Raised frame, recessed panes and a small latch give the window depth.
  for (const x of [-6.91, -2.69]) box(room, .14, 4.5, .24, windowFrame, x, 2.4, -5.35)
  for (const y of [.2, 4.6]) box(room, 4.36, .14, .24, windowFrame, -4.8, y, -5.35)
  box(room, .055, .25, .07, brass, -4.68, 2.28, -5.25)
  box(room, 4.42, .1, .24, plaster, -4.8, -.03, -5.4)
  const pot = mat(0xb87b60), leaf = mat(0x567863), stem = mat(0x53644d)
  roomSurface(pot, clayTexture, 3, 1, .012)
  roomSurface(leaf, leafTexture, 1, 1, .004)
  leaf.side = THREE.DoubleSide; leaf.roughness = .52
  const plant = new THREE.Group(); plant.position.set(5.8, -2.83, -3.2); room.add(plant)
  const potProfile = [[0, .07], [.4, .07], [.43, .1], [.57, .82], [.59, .85], [.59, .9], [.53, .9], [.52, .82], [.39, .17], [0, .17]].map(([r, y]) => new THREE.Vector2(r, y))
  mesh(plant, new THREE.LatheGeometry(potProfile, 40), pot)
  cylinder(plant, .62, .055, pot, 0, .028)
  const soil = mat(0x46392d, 1)
  roomSurface(soil, soilTexture, 3, 3, .025)
  cylinder(plant, .515, .04, soil, 0, .79)
  tube(plant, [[0, .8, 0], [-.06, 1.4, .02], [.04, 2.1, 0], [-.03, 2.85, .04]], .025, stem)
  for (let i = 0; i < 9; i++) {
    const angle = i * 2.4
    const y = 1.04 + i * .19
    const length = .72 - i * .027
    const branch = new THREE.Group(); branch.position.set(0, y, 0); branch.rotation.y = angle; plant.add(branch)
    tube(branch, [[0, 0, 0], [.16, .12, 0], [.3, .2, 0]], .012, stem)
    // Tapered, folded blades replace the old oval leaf solids.
    const geometry = new THREE.PlaneGeometry(length, .42, 12, 6)
    const positions = geometry.attributes.position
    for (let j = 0; j < positions.count; j++) {
      const t = (positions.getX(j) + length / 2) / length
      const across = positions.getY(j) / .21
      positions.setXYZ(j, .24 + t * length, .18 + Math.sin(t * Math.PI) * .17 - t * .09 + Math.abs(across) * .035, across * .21 * Math.sin(Math.PI * t))
    }
    geometry.computeVertexNormals()
    mesh(branch, geometry, leaf)
    tube(branch, [[.24, .184, 0], [.24 + length * .5, .309, 0], [.24 + length, .094, 0]], .006, stem)
  }
  // Subtle floorboard seams establish depth without distracting from the objects.
  const seam = mat(0x65665f)
  for (let i = -12; i <= 12; i++) box(room, .014, .006, 50, seam, i * 1.4, -2.824, 4)
  scene.add(new THREE.HemisphereLight(0xe1efff, 0xa69578, .5))
  const sun = new THREE.DirectionalLight(0xffe1ad, .22); sun.position.set(-4.8, 7, -4); sun.castShadow = false
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -8; sun.shadow.camera.right = 8; sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8; sun.shadow.normalBias = .035; scene.add(sun)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  // Project window light through a shadow-casting light, not painted floor planes.
  const lightCanvas = document.createElement('canvas')
  lightCanvas.width = 512; lightCanvas.height = 512
  const context = lightCanvas.getContext('2d')!
  context.filter = 'blur(9px)'; context.fillStyle = '#fff0bd'
  for (const x of [30, 272]) for (const y of [30, 272]) context.fillRect(x, y, 210, 210)
  const lightTexture = new THREE.CanvasTexture(lightCanvas)
  lightTexture.colorSpace = THREE.SRGBColorSpace; textures.push(lightTexture)
  const windowSun = new THREE.SpotLight(0xffe6bf, 55, 30, .64, .5, 2)
  windowSun.position.set(-4.8, 4.25, -5.15)
  windowSun.target.position.set(-.3, -.25, .7)
  windowSun.map = lightTexture; windowSun.castShadow = true
  windowSun.shadow.mapSize.set(2048, 2048)
  windowSun.shadow.normalBias = .008; windowSun.shadow.bias = -.00005
  windowSun.shadow.camera.near = .2; windowSun.shadow.camera.far = 30
  scene.add(windowSun, windowSun.target)
  const windowFill = new THREE.PointLight(0xc7e3ff, 4, 12, 2)
  windowFill.position.set(-4.8, 2.4, -4.8); scene.add(windowFill)
  let hovered: DeskItem | null = null
  let lampOn = true
  const ray = new THREE.Raycaster(), pointer = new THREE.Vector2()
  const pick = (event: PointerEvent) => {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1)
    ray.setFromCamera(pointer, camera)
    const hit = ray.intersectObjects([...groups.values()], true)[0]
    let object: THREE.Object3D | null = hit?.object ?? null
    while (object && !object.userData.id) object = object.parent
    return (object?.userData.id as DeskItem | undefined) ?? null
  }
  const select = (id: DeskItem) => {
    if (id === 'lamp') { lampOn = !lampOn; powerSwitch.rotation.x = lampOn ? -.15 : .15; onLamp(lampOn) }
    else onPick(id)
  }
  const move = (event: PointerEvent) => {
    if (down && (event.pointerId !== down.id || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6)) down.dragged = true
    if (down?.dragged) { hovered = null; onHover(null); renderer.domElement.style.cursor = 'grabbing'; return }
    hovered = pick(event); renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab'; onHover(hovered)
  }
  const leave = () => { hovered = null; onHover(null) }
  let down: { x: number; y: number; id: number; dragged: boolean } | null = null
  const start = (event: PointerEvent) => {
    if (down) { down.dragged = true; return }
    if (event.button !== 0 || !event.isPrimary) return
    down = { x: event.clientX, y: event.clientY, id: event.pointerId, dragged: false }
  }
  const cancel = () => { down = null; leave(); renderer.domElement.style.cursor = 'grab' }
  const click = (event: PointerEvent) => {
    const activate = down && event.pointerId === down.id && !down.dragged && Math.hypot(event.clientX - down.x, event.clientY - down.y) <= 6
    down = null
    renderer.domElement.style.cursor = 'grab'
    if (activate) { const id = pick(event); if (id) select(id) }
  }
  const directions: Record<DeskView, THREE.Vector3> = {
    front: new THREE.Vector3(0, .65, .76).normalize(),
    top: new THREE.Vector3(0, 1, .06).normalize(),
    angle: new THREE.Vector3(.45, .72, .55).normalize(),
  }
  let currentView: DeskView | null = 'angle'
  const direction = directions.angle.clone()
  const fitCamera = () => {
    // Fit the tabletop and tall lamp inside the space between the title and menu.
    const focus = new THREE.Vector3(0, .65, 0)
    camera.position.copy(focus).add(direction); camera.lookAt(focus)
    camera.updateMatrixWorld()
    const inverseRotation = camera.quaternion.clone().invert()
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    let distance = 0
    for (const x of [-4.5, 4.5]) for (const y of [-.35, 2.3]) for (const z of [-2.8, 2.8]) {
      const point = new THREE.Vector3(x, y, z).sub(focus).applyQuaternion(inverseRotation)
      distance = Math.max(distance, point.z + Math.abs(point.x) / (tangent * camera.aspect * .92), point.z + Math.abs(point.y) / (tangent * .57))
    }
    camera.position.copy(focus).addScaledVector(direction, distance)
    camera.lookAt(focus); camera.updateProjectionMatrix(); camera.updateMatrixWorld()
  }
  const resize = () => {
    const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1)
    renderer.setSize(width, height); camera.aspect = width / height
    fitCamera()
  }
  const observer = new ResizeObserver(resize); observer.observe(host); resize()
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, .65, 0)
  controls.enablePan = false; controls.enableZoom = false
  controls.enableDamping = !reduced.matches; controls.dampingFactor = .09
  controls.rotateSpeed = .55
  controls.minAzimuthAngle = -Math.PI * 40 / 180; controls.maxAzimuthAngle = Math.PI * 40 / 180
  controls.minPolarAngle = .06; controls.maxPolarAngle = Math.PI * 55 / 180
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }
  controls.update()
  const beginOrbit = () => { currentView = null }
  controls.addEventListener('start', beginOrbit)
  renderer.domElement.style.cursor = 'grab'
  renderer.domElement.addEventListener('pointermove', move); renderer.domElement.addEventListener('pointerleave', leave)
  renderer.domElement.addEventListener('pointerdown', start); renderer.domElement.addEventListener('pointerup', click)
  renderer.domElement.addEventListener('pointercancel', cancel)
  renderer.domElement.addEventListener('lostpointercapture', cancel)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  let previousTime = 0
  renderer.setAnimationLoop((time: number) => {
    const delta = Math.min((time - previousTime) / 1000, .05); previousTime = time
    if (document.hidden) return
    const lampBlend = reduced.matches ? 1 : 1 - Math.exp(-18 * delta)
    light.intensity = THREE.MathUtils.lerp(light.intensity, lampOn ? lampIntensity : 0, lampBlend)
    if (!lampOn && light.intensity < .01) light.intensity = 0
    bulbMat.emissiveIntensity = 2.5 * light.intensity / lampIntensity
    controls.enableDamping = !reduced.matches
    if (currentView === null) {
      controls.update(delta)
      direction.copy(camera.position).sub(controls.target).normalize()
      fitCamera()
    } else if (direction.distanceToSquared(directions[currentView]) > .000001) {
      direction.lerp(directions[currentView], reduced.matches ? 1 : 1 - Math.exp(-6 * delta)).normalize()
      fitCamera()
    }
    groups.forEach((g, id) => { const target = hovered === id && id !== 'lamp' && !reduced.matches ? .18 : .04; g.position.y = THREE.MathUtils.lerp(g.position.y, target, reduced.matches ? 1 : .14) })
    renderer.render(scene, camera)
  })
  return {
    select,
    setView: (view: DeskView) => {
      controls.enableDamping = false; controls.update()
      controls.enableDamping = !reduced.matches
      currentView = view
      hovered = null; onHover(null); renderer.domElement.style.cursor = 'default'
      if (reduced.matches) { direction.copy(directions[view]); fitCamera() }
    },
    highlight: (id: DeskItem | null) => { hovered = id },
    dispose: () => {
      renderer.setAnimationLoop(null); observer.disconnect()
      controls.removeEventListener('start', beginOrbit); controls.dispose()
      renderer.domElement.removeEventListener('pointermove', move); renderer.domElement.removeEventListener('pointerleave', leave)
      renderer.domElement.removeEventListener('pointerdown', start); renderer.domElement.removeEventListener('pointerup', click)
      renderer.domElement.removeEventListener('pointercancel', cancel)
      renderer.domElement.removeEventListener('lostpointercapture', cancel)
      scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose() })
      sun.shadow.map?.dispose(); windowSun.shadow.map?.dispose(); light.shadow.map?.dispose(); environment.dispose()
      materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); renderer.dispose(); renderer.domElement.remove()
    },
  }
}
