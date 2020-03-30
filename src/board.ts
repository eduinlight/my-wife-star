import Point2D from './point'
import Triangle from './triangle'
import Star from './star'

type Color = string | CanvasGradient | CanvasPattern

class Board {
  width: number
  height: number
  context: CanvasRenderingContext2D

  constructor (context: CanvasRenderingContext2D, width: number, height: number) {
    this.width = width
    this.height = height
    this.context = context
  }

  toXY (point: Point2D): Point2D {
    return new Point2D(
      point.x + this.width / 2.0,
      -point.y + this.height / 2.0
    )
  }

  drawLine (from: Point2D, to: Point2D): void {
    const fromTransformed = this.toXY(from)
    const toTransformed = this.toXY(to)
    this.context.moveTo(fromTransformed.x, fromTransformed.y)
    this.context.lineTo(toTransformed.x, toTransformed.y)
    this.context.stroke()
  }

  drawCircle (center: Point2D, radius: number): void {
    const centerTransformed = this.toXY(center)
    this.context.beginPath()
    this.context.arc(centerTransformed.x, centerTransformed.y, radius, 0, 2 * Math.PI)
    this.context.stroke()
  }

  fillCircle (center: Point2D, radius: number, color: Color = 'black'): void {
    const centerTransformed = this.toXY(center)
    this.context.beginPath()
    this.context.arc(centerTransformed.x, centerTransformed.y, radius, 0, 2 * Math.PI)
    this.context.fillStyle = color
    this.context.fill()
  }

  drawTriangle (triangle: Triangle): void {
    const triangleTransformed = new Triangle(this.toXY(triangle.a), this.toXY(triangle.b), this.toXY(triangle.c))
    this.context.beginPath()
    this.context.moveTo(triangleTransformed.a.x, triangleTransformed.a.y)
    this.context.lineTo(triangleTransformed.b.x, triangleTransformed.b.y)
    this.context.lineTo(triangleTransformed.c.x, triangleTransformed.c.y)
    this.context.lineTo(triangleTransformed.a.x, triangleTransformed.a.y)
    this.context.stroke()
  }

  fillTriangle (triangle: Triangle, color: Color = 'black'): void {
    const triangleTransformed = new Triangle(this.toXY(triangle.a), this.toXY(triangle.b), this.toXY(triangle.c))
    this.context.beginPath()
    this.context.moveTo(triangleTransformed.a.x, triangleTransformed.a.y)
    this.context.lineTo(triangleTransformed.b.x, triangleTransformed.b.y)
    this.context.lineTo(triangleTransformed.c.x, triangleTransformed.c.y)
    this.context.lineTo(triangleTransformed.a.x, triangleTransformed.a.y)
    this.context.fillStyle = color
    this.context.fill()
  }

  drawPoint (point: Point2D, radius = 2): void {
    this.drawCircle(point, radius)
  }

  fillPoint (point: Point2D, radius = 2, color: Color = 'black'): void {
    this.fillCircle(point, radius, color)
  }

  drawStar (star: Star): void {
    for (const triangle of star.triangles) {
      this.drawTriangle(triangle)
    }
  }

  fillStar (star: Star, colors: Color[] = ['red', 'black']): void {
    let pos = -1

    const nextColor = () => {
      pos = (pos + 1) % colors.length
      return colors[pos]
    }

    for (const triangle of star.triangles) {
      const color = nextColor()
      this.fillTriangle(triangle, color)
    }
  }
}

export default Board
