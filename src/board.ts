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

    this.configure()
  }

  configure (): void {
    this.context.translate(this.width / 2.0, this.height / 2.0)
  }

  drawLine (from: Point2D, to: Point2D): void {
    this.context.moveTo(from.x, from.y)
    this.context.lineTo(to.x, to.y)
    this.context.stroke()
  }

  drawCircle (center: Point2D, radius: number): void {
    this.context.beginPath()
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    this.context.stroke()
  }

  fillCircle (center: Point2D, radius: number, color: Color = 'black'): void {
    this.context.beginPath()
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    this.context.fillStyle = color
    this.context.fill()
  }

  drawTriangle (triangle: Triangle): void {
    this.context.beginPath()
    this.context.moveTo(triangle.a.x, triangle.a.y)
    this.context.lineTo(triangle.b.x, triangle.b.y)
    this.context.lineTo(triangle.c.x, triangle.c.y)
    this.context.lineTo(triangle.a.x, triangle.a.y)
    this.context.stroke()
  }

  fillTriangle (triangle: Triangle, color: Color = 'black'): void {
    this.context.beginPath()
    this.context.moveTo(triangle.a.x, triangle.a.y)
    this.context.lineTo(triangle.b.x, triangle.b.y)
    this.context.lineTo(triangle.c.x, triangle.c.y)
    this.context.lineTo(triangle.a.x, triangle.a.y)
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
