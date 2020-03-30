import Triangle from './triangle'
import Point2D from './point'
import Angle from './angle'

export default class Star {
  triangles: Triangle[] = []
  size: number
  position: Point2D
  numPoints: number

  constructor (position: Point2D, size: number, numPoints: number = 5) {
    this.size = size
    this.position = position
    this.numPoints = numPoints
    this.generateStar()
  }

  generateStar (): void {
    const circleOutRadius = this.size / 2
    const circleInRadius = circleOutRadius / 2

    const innerPoints = this.generateCirclePoints(circleInRadius)
    const outerPoints = this.generateCirclePoints(
      circleOutRadius
    ).map(point => point.rotate(new Angle(360 / this.numPoints / 2)))

    this.triangles = this.generateTriangles(innerPoints, outerPoints)
  }

  private generateCirclePoints (radius: number): Point2D[] {
    const angle = new Angle(360.0 / this.numPoints)
    const startPoint = new Point2D(radius, 0)
    const points = [startPoint]
    for (let i = 1; i < this.numPoints; i++) {
      const point = points[i - 1]
      points.push(point.rotate(angle))
    }

    return points
  }

  private generateTriangles (innerPoints: Point2D[], outerPoints: Point2D[]): Triangle[] {
    const triangles: Triangle[] = []
    const numPoints = innerPoints.length
    for (let i = 0; i < numPoints; i++) {
      const nextI = (i + 1) % numPoints

      triangles.push(new Triangle(this.position, outerPoints[i], innerPoints[i]))
      triangles.push(new Triangle(this.position, outerPoints[i], innerPoints[nextI]))
    }

    return triangles
  }
}
