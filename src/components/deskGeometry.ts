import { LatheGeometry, PlaneGeometry, Vector2 } from 'three'

/** A gently lifted front corner; UVs remain unchanged so print follows the paper. */
export function createPaperGeometry(width: number, depth: number, lift: number) {
  const geometry = new PlaneGeometry(width, depth, 28, 24)
  const positions = geometry.attributes.position
  for (let index = 0; index < positions.count; index++) {
    const across = (positions.getX(index) + width / 2) / width
    const towardFront = (depth / 2 - positions.getY(index)) / depth
    const curl = lift * across ** 5 * towardFront ** 5
    const bow = lift * .08 * Math.sin(across * Math.PI) * towardFront ** 2
    positions.setZ(index, curl + bow)
  }
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}

/** Closed rim with an inner wall, instead of an infinitely thin cone. */
export function createShadeGeometry() {
  const profile = [
    [.6, 0], [.62, .012], [.621, .035], [.6, .055],
    [.49, .15], [.37, .29], [.25, .45], [.23, .48],
    [.205, .48], [.215, .445], [.34, .28], [.465, .14],
    [.575, .045], [.585, .025], [.6, 0],
  ].map(([radius, height]) => new Vector2(radius, height))
  return new LatheGeometry(profile, 64)
}
