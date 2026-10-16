import * as THREE from 'three'

export function createPaperScene(host: HTMLElement, source: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  host.append(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 6.4)
  const paper = new THREE.Group()
  scene.add(paper, new THREE.AmbientLight(0xffffff, 2))
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-3, 4, 6)
  scene.add(light)
  const textureCanvas = document.createElement('canvas')
  textureCanvas.width = textureCanvas.height = 1024
  const ctx = textureCanvas.getContext('2d')!
  ctx.fillStyle = '#fff9e9'
  ctx.fillRect(0, 0, 1024, 1024)
  ctx.drawImage(source, 0, 0, 1024, 1024)
  const texture = new THREE.CanvasTexture(textureCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const front = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.95,
    side: THREE.FrontSide,
  })
  const back = new THREE.MeshStandardMaterial({
    color: '#e9dfc7',
    roughness: 1,
    side: THREE.BackSide,
  })
  const outline = new THREE.LineBasicMaterial({
    color: '#ac9e83',
    transparent: true,
    opacity: 0.55,
  })
  const guideMaterial = new THREE.LineDashedMaterial({
    color: '#376797',
    dashSize: 0.07,
    gapSize: 0.045,
    depthTest: false,
  })
  const guideGeometry = new THREE.BufferGeometry()
  const guide = new THREE.LineSegments(guideGeometry, guideMaterial)
  guide.renderOrder = 10
  paper.add(guide)
  type Panel = {
    side: number
    corner: boolean
    outer: boolean
    points: THREE.Vector3[]
    geometry: THREE.BufferGeometry
    edge: THREE.BufferGeometry
  }
  const panels: Panel[] = []
  for (const side of [-1, 1]) {
    const definitions = [
      {
        corner: true,
        outer: true,
        xy: [
          [0, 1.3],
          [side, 1.3],
          [side, 0.3],
        ],
      },
      {
        corner: false,
        outer: true,
        xy: [
          [0, 1.3],
          [side, 0.3],
          [side, -1.3],
          [side * 0.25, -1.3],
        ],
      },
      {
        corner: false,
        outer: false,
        xy: [
          [0, 1.3],
          [side * 0.25, -1.3],
          [0, -1.3],
        ],
      },
    ]
    for (const item of definitions) {
      const points = item.xy.map(([x, y]) => new THREE.Vector3(x, y, 0))
      // Orient every face towards the viewer before folding.
      if (
        new THREE.Vector3()
          .subVectors(points[1], points[0])
          .cross(new THREE.Vector3().subVectors(points[2], points[0])).z < 0
      )
        points.reverse()
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          points.flatMap((p) => p.toArray()),
          3,
        ),
      )
      geometry.setAttribute(
        'uv',
        new THREE.Float32BufferAttribute(
          points.flatMap((p) => [(p.x + 1) / 2, (p.y + 1.3) / 2.6]),
          2,
        ),
      )
      geometry.setIndex(points.length === 3 ? [0, 1, 2] : [0, 1, 2, 0, 2, 3])
      geometry.computeVertexNormals()
      paper.add(new THREE.Mesh(geometry, front), new THREE.Mesh(geometry, back))
      const edge = new THREE.BufferGeometry()
      paper.add(new THREE.LineLoop(edge, outline))
      panels.push({ side, corner: item.corner, outer: item.outer, points, geometry, edge })
    }
  }
  const rotate = (p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, angle: number) =>
    p.sub(a).applyAxisAngle(b.clone().sub(a).normalize(), angle).add(a)
  const apex = new THREE.Vector3(0, 1.3, 0)
  const origin = new THREE.Vector3()
  const yAxis = new THREE.Vector3(0, 1, 0)
  let step = 0
  let progress = 0
  let flight = 0
  let targetFlight = false
  let reduced = false
  let frame = 0
  let previous = 0
  const update = (time: number) => {
    const dt = Math.min((time - previous) / 1000 || 0.016, 0.05)
    previous = time
    progress = reduced ? step : THREE.MathUtils.damp(progress, step, 7, dt)
    flight = targetFlight ? Math.min(1, flight + dt / (reduced ? 0.15 : 1.7)) : 0
    const fold = Math.min(progress, 1)
    const body = THREE.MathUtils.clamp(progress - 1, 0, 1)
    const wings = THREE.MathUtils.clamp(progress - 2, 0, 1)
    for (const panel of panels) {
      const positions = panel.points.map((original) => {
        const p = original.clone()
        if (panel.corner)
          rotate(
            p,
            apex,
            new THREE.Vector3(panel.side, 0.3, 0),
            panel.side * Math.PI * 0.995 * fold,
          )
        if (panel.outer)
          rotate(p, apex, new THREE.Vector3(panel.side * 0.25, -1.3, 0), (-Math.PI / 3) * wings)
        rotate(p, origin, yAxis, panel.side * Math.PI * 0.36 * body)
        return p
      })
      const attribute = panel.geometry.getAttribute('position')
      positions.forEach((p, i) => attribute.setXYZ(i, p.x, p.y, p.z))
      attribute.needsUpdate = true
      panel.geometry.computeVertexNormals()
      panel.edge.setFromPoints(positions)
    }
    const lines =
      step === 0
        ? [apex, new THREE.Vector3(-1, 0.3, 0), apex, new THREE.Vector3(1, 0.3, 0)]
        : step === 1
          ? [apex, new THREE.Vector3(0, -1.3, 0)]
          : [apex, new THREE.Vector3(-0.25, -1.3, 0), apex, new THREE.Vector3(0.25, -1.3, 0)]
    guideGeometry.setFromPoints(lines)
    guideGeometry.setDrawRange(0, lines.length)
    guide.computeLineDistances()
    guide.visible = step < 3 && Math.abs(progress - step) < 0.03
    paper.rotation.set(-0.2 * body, -0.25 * body, -0.12 * wings)
    paper.position.set(reduced ? 0 : flight * 5, reduced ? 0 : flight * flight * 5, -flight * 5)
    paper.rotation.z -= reduced ? 0 : flight * 0.7
    paper.scale.setScalar(1 - flight * 0.7)
    paper.visible = flight < 1
    renderer.render(scene, camera)
    frame = requestAnimationFrame(update)
  }
  const observer = new ResizeObserver(() => {
    const width = host.clientWidth,
      height = host.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  })
  observer.observe(host)
  frame = requestAnimationFrame(update)
  return {
    setStep(value: number, reduce: boolean) {
      step = value
      reduced = reduce
      targetFlight = false
      flight = 0
    },
    fly(reduce: boolean) {
      reduced = reduce
      targetFlight = true
    },
    dispose() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      panels.forEach((p) => {
        p.geometry.dispose()
        p.edge.dispose()
      })
      guideGeometry.dispose()
      guideMaterial.dispose()
      outline.dispose()
      texture.dispose()
      front.dispose()
      back.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
