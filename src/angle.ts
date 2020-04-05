import Radian from './radian'

export default class Angle {
  value: number

  constructor (value: number) {
    this.value = value
  }

  toRadian (): Radian {
    return new Radian(this.value * Math.PI / 180)
  }
}
