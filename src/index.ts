import Board from './board'
import Star from './star'
import Point2D from './point'

const root = document.querySelector('#root') as HTMLDivElement

const container = document.createElement('div')
container.style.display = 'flex'
container.style.flexWrap = 'wrap'

root.appendChild(container)

const starSize = 200
const totalPoints = 30

for (let i = 1; i <= totalPoints; i++) {
  const canvas = document.createElement('canvas')
  canvas.width = starSize
  canvas.height = starSize

  const text = document.createElement('h5')
  text.innerHTML = `${i} point${i === 1 ? '' : 's'}`
  text.style.textAlign = 'center'

  const card = document.createElement('div')
  card.style.margin = '2px'
  card.appendChild(text)
  card.appendChild(canvas)

  container.appendChild(card)

  const context = canvas.getContext('2d')
  if (context !== null) {
    const board = new Board(context, starSize, starSize)
    const star = new Star(new Point2D(0, 0), 200, i)

    board.fillStar(star)
  }
}
