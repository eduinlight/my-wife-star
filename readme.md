## The star of my wife

My wife love to draw stars in his notebook, I tell her that I can do with programming a perfect star, and that is how this repo comes to life.

### Site url

[https://my-wife-star.now.sh/](https://my-wife-star.now.sh/)

### Image

[Stars]('https://github.com/eduinlight/my-wife-star/blob/master/image.png' "stars")

### For developpers

You can use the classes defined on this repo to draw a star on a HTML5 canvas. I will show you how to do it:

```Typescript
import Board from './board'
import Star from './star'
import Point2D from './point'

const root = document.querySelector('body') as HTMLBodyElement

const starSize = 200
const starPoints = 5

const canvas = document.createElement('canvas')
canvas.width = starSize
canvas.height = starSize

root.appendChild(canvas)

const context = canvas.getContext('2d')
if (context !== null) {
  const board = new Board(context, starSize, starSize)
  const star = new Star(new Point2D(0, 0), starSize, starPoints)

  board.fillStar(star)
}
```

## License

This project is licensed under the MIT license, see
[LICENSE](https://github.com/eduinlight/my-wife-star/blob/master/LICENSE).
