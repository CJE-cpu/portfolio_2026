export type Mark = 'X' | 'O' | null

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export function getWinningLine(board: Mark[]) {
  return lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c])
}

export function chooseMove(board: Mark[]): number | undefined {
  const empty = board.flatMap((mark, index) => mark ? [] : [index])
  if (getWinningLine(board) || !empty.length) return undefined
  // Finish a line or block the player before choosing a free square.
  for (const mark of ['O', 'X'] as const) {
    const move = empty.find(index => {
      const next = [...board]
      next[index] = mark
      return Boolean(getWinningLine(next))
    })
    if (move !== undefined) return move
  }
  return empty[Math.floor(Math.random() * empty.length)]
}
