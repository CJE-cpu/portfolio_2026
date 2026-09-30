type Target = { x: number; y: number }

export const MAX_COORDINATE = 5

export function createRandomTarget(previous?: Target): Target {
  const candidates: Target[] = []

  for (let x = 1; x <= MAX_COORDINATE; x++) {
    // With a and b between 0 and 1, y = ax + b cannot exceed x + 1.
    for (let y = 1; y <= Math.min(MAX_COORDINATE, x + 1); y++) {
      if (previous?.x !== x || previous?.y !== y) {
        candidates.push({ x, y })
      }
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}
