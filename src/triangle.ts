import Point2D from './point'

export default class Triangle {
  b: Point2D
  a: Point2D
  c: Point2D

  constructor (a: Point2D, b: Point2D, c: Point2D) {
    this.a = a
    this.b = b
    this.c = c
  }
}
