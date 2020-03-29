const drawBoard = document.querySelector('canvas')
const context = drawBoard.getContext('2d')
const board = {
  width: 200.0,
  height: 200.0
}
const pointRadius = 2
const rotationMatrix = [
  [a => Math.cos(a), a => -Math.sin(a)],
  [a => Math.sin(a), a => Math.cos(a)]
]

function angleToRadian (angle) {
  return (angle * Math.PI) / 180
}

function vectorScalarProduct (vector, scalar) {
  return { x: vector.x * scalar, y: vector.y * scalar }
}

function rotatePoint (point, angle) {
  const radian = angleToRadian(angle)
  const rotationMatrix = [
    [Math.cos(radian), -Math.sin(radian)],
    [Math.sin(radian), Math.cos(radian)]
  ]

  // matrix multiplication
  return {
    x: point.x * rotationMatrix[0][0] + point.y * rotationMatrix[1][0],
    y: point.x * rotationMatrix[0][1] + point.y * rotationMatrix[1][1]
  }
}

function toXY (point) {
  return {
    x: point.x + board.width / 2.0,
    y: -point.y + board.height / 2.0
  }
}

function drawCircle (center, radius) {
  context.beginPath()
  context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
  context.stroke()
}

function drawPoint (point) {
  drawCircle(point, pointRadius)
}

function drawLine (from, to) {
  context.moveTo(from.x, from.y)
  context.lineTo(to.x, to.y)
  context.stroke()
}

function drawTriangle (a, b, c, color = 'black') {
  context.beginPath()
  context.moveTo(a.x, a.y)
  context.lineTo(b.x, b.y)
  context.lineTo(c.x, c.y)
  context.lineTo(a.x, a.y)
  context.fillStyle = color
  context.fill()
}

const center = { x: 0, y: 0 }
drawPoint(toXY(center))

const circleOutRadius = board.width / 2
const circleInRadius = circleOutRadius / 2
drawCircle(toXY(center), circleOutRadius)
drawCircle(toXY(center), circleInRadius)

// draw star
function generateStarPoints (starPoints, radius) {
  const starAngle = 360.0 / starPoints
  const points = [{ x: radius, y: 0 }]
  for (let i = 1; i <= starPoints; i++) {
    const point = points[i - 1]
    const pointRotated = rotatePoint(point, starAngle)
    points.push(pointRotated)
  }

  return points
}

function drawStar (starPoints = 5) {
  const innerPoints = generateStarPoints(starPoints, circleInRadius)
  const outerPoints = generateStarPoints(
    starPoints,
    circleOutRadius
  ).map(point => rotatePoint(point, 360 / starPoints / 2))

  // build triangles
  const triangles = []
  for (let i = 0; i < starPoints; i++) {
    const nextI = (i + 1) % starPoints

    drawPoint(toXY(outerPoints[i]))
    drawPoint(toXY(innerPoints[i]))

    triangles.push([center, outerPoints[i], innerPoints[i]])
    triangles.push([center, outerPoints[i], innerPoints[i + 1]])
  }

  // for (let i = 0 i < triangles.length i++) {
  //   const triangle = triangles[i]
  //   drawTriangle(
  //     toXY(triangle[0]),
  //     toXY(triangle[1]),
  //     toXY(triangle[2]),
  //     i % 2 == 0 ? "red" : "black"
  //   )
  // }
}

drawStar(6)
