import Angle from './angle'

export default class Point2D {
  x: number
  y: number

  constructor (x: number, y:number) {
    this.x = x
    this.y = y
  }

  rotate (angle: Angle): Point2D {
    const { value } = angle.toRadian()
    const rotationMatrix = [
      [Math.cos(value), -Math.sin(value)],
      [Math.sin(value), Math.cos(value)]
    ]

    // matrix multiplication
    return new Point2D(
      this.x * rotationMatrix[0][0] + this.y * rotationMatrix[1][0],
      this.x * rotationMatrix[0][1] + this.y * rotationMatrix[1][1]
    )
  }
}
