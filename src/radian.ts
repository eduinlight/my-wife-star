import Angle from './radian'

export default class Radian {
  value: number

  constructor (value: number) {
    this.value = value
  }

  toAngle (): Angle {
    return new Angle(this.value * 180 / Math.PI)
  }
}
