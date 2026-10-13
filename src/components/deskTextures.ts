import * as THREE from 'three'

/** Seamless local surface maps; generated once when the desk mounts. */
export function createRoomTexture(kind: 'plaster' | 'clay' | 'soil' | 'leaf') {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')!
  const pixels = context.createImageData(size, size)
  let seed = 137
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const noise = seed / 4294967296
    const u = x / size, v = y / size
    const wave = Math.sin(u * Math.PI * 8) * Math.cos(v * Math.PI * 6)
    let value = 240 + wave * 5 + (noise - .5) * 15
    if (kind === 'clay') value = 235 + Math.sin(v * Math.PI * 48) * 6 + (noise - .5) * 24
    if (kind === 'soil') value = 190 + wave * 18 + (noise - .5) * 95
    if (kind === 'leaf') {
      const center = Math.exp(-Math.abs(v - .5) * 130)
      const veins = Math.pow(Math.max(0, Math.cos((u * 9 - Math.abs(v - .5) * 5) * Math.PI * 2)), 22)
      value = 220 + center * 27 + veins * 15 + (noise - .5) * 7
    }
    const index = (y * size + x) * 4
    pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = value
    pixels.data[index + 3] = 255
  }
  context.putImageData(pixels, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}
