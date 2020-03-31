(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const radian_1 = __importDefault(require("./radian"));
class Angle {
    constructor(value) {
        this.value = value;
    }
    toRadian() {
        return new radian_1.default(this.value * Math.PI / 180);
    }
}
exports.default = Angle;

},{"./radian":5}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = __importDefault(require("./point"));
const triangle_1 = __importDefault(require("./triangle"));
class Board {
    constructor(context, width, height) {
        this.width = width;
        this.height = height;
        this.context = context;
    }
    toXY(point) {
        return new point_1.default(point.x + this.width / 2.0, -point.y + this.height / 2.0);
    }
    drawLine(from, to) {
        const fromTransformed = this.toXY(from);
        const toTransformed = this.toXY(to);
        this.context.moveTo(fromTransformed.x, fromTransformed.y);
        this.context.lineTo(toTransformed.x, toTransformed.y);
        this.context.stroke();
    }
    drawCircle(center, radius) {
        const centerTransformed = this.toXY(center);
        this.context.beginPath();
        this.context.arc(centerTransformed.x, centerTransformed.y, radius, 0, 2 * Math.PI);
        this.context.stroke();
    }
    fillCircle(center, radius, color = 'black') {
        const centerTransformed = this.toXY(center);
        this.context.beginPath();
        this.context.arc(centerTransformed.x, centerTransformed.y, radius, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
    }
    drawTriangle(triangle) {
        const triangleTransformed = new triangle_1.default(this.toXY(triangle.a), this.toXY(triangle.b), this.toXY(triangle.c));
        this.context.beginPath();
        this.context.moveTo(triangleTransformed.a.x, triangleTransformed.a.y);
        this.context.lineTo(triangleTransformed.b.x, triangleTransformed.b.y);
        this.context.lineTo(triangleTransformed.c.x, triangleTransformed.c.y);
        this.context.lineTo(triangleTransformed.a.x, triangleTransformed.a.y);
        this.context.stroke();
    }
    fillTriangle(triangle, color = 'black') {
        const triangleTransformed = new triangle_1.default(this.toXY(triangle.a), this.toXY(triangle.b), this.toXY(triangle.c));
        this.context.beginPath();
        this.context.moveTo(triangleTransformed.a.x, triangleTransformed.a.y);
        this.context.lineTo(triangleTransformed.b.x, triangleTransformed.b.y);
        this.context.lineTo(triangleTransformed.c.x, triangleTransformed.c.y);
        this.context.lineTo(triangleTransformed.a.x, triangleTransformed.a.y);
        this.context.fillStyle = color;
        this.context.fill();
    }
    drawPoint(point, radius = 2) {
        this.drawCircle(point, radius);
    }
    fillPoint(point, radius = 2, color = 'black') {
        this.fillCircle(point, radius, color);
    }
    drawStar(star) {
        for (const triangle of star.triangles) {
            this.drawTriangle(triangle);
        }
    }
    fillStar(star, colors = ['red', 'black']) {
        let pos = -1;
        const nextColor = () => {
            pos = (pos + 1) % colors.length;
            return colors[pos];
        };
        for (const triangle of star.triangles) {
            const color = nextColor();
            this.fillTriangle(triangle, color);
        }
    }
}
exports.default = Board;

},{"./point":4,"./triangle":7}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __importDefault(require("./board"));
const star_1 = __importDefault(require("./star"));
const point_1 = __importDefault(require("./point"));
const root = document.querySelector('#root');
const container = document.createElement('div');
container.style.display = 'flex';
container.style.flexWrap = 'wrap';
root.appendChild(container);
const starSize = 200;
const totalPoints = 30;
for (let i = 1; i <= totalPoints; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = starSize;
    canvas.height = starSize;
    const text = document.createElement('h5');
    text.innerHTML = `${i} points`;
    text.style.textAlign = 'center';
    const card = document.createElement('div');
    card.style.margin = '2px';
    card.appendChild(text);
    card.appendChild(canvas);
    container.appendChild(card);
    const context = canvas.getContext('2d');
    if (context !== null) {
        const board = new board_1.default(context, starSize, starSize);
        const star = new star_1.default(new point_1.default(0, 0), 200, i);
        board.fillStar(star);
    }
}

},{"./board":2,"./point":4,"./star":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    rotate(angle) {
        const { value } = angle.toRadian();
        const rotationMatrix = [
            [Math.cos(value), -Math.sin(value)],
            [Math.sin(value), Math.cos(value)]
        ];
        // matrix multiplication
        return new Point2D(this.x * rotationMatrix[0][0] + this.y * rotationMatrix[1][0], this.x * rotationMatrix[0][1] + this.y * rotationMatrix[1][1]);
    }
}
exports.default = Point2D;

},{}],5:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const radian_1 = __importDefault(require("./radian"));
class Radian {
    constructor(value) {
        this.value = value;
    }
    toAngle() {
        return new radian_1.default(this.value * 180 / Math.PI);
    }
}
exports.default = Radian;

},{"./radian":5}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const triangle_1 = __importDefault(require("./triangle"));
const point_1 = __importDefault(require("./point"));
const angle_1 = __importDefault(require("./angle"));
class Star {
    constructor(position, size, numPoints = 5) {
        this.triangles = [];
        this.size = size;
        this.position = position;
        this.numPoints = numPoints;
        this.generateStar();
    }
    generateStar() {
        const circleOutRadius = this.size / 2;
        const circleInRadius = circleOutRadius / 2;
        const innerPoints = this.generateCirclePoints(circleInRadius);
        const outerPoints = this.generateCirclePoints(circleOutRadius).map(point => point.rotate(new angle_1.default(360 / this.numPoints / 2)));
        this.triangles = this.generateTriangles(innerPoints, outerPoints);
    }
    generateCirclePoints(radius) {
        const angle = new angle_1.default(360.0 / this.numPoints);
        const startPoint = new point_1.default(radius, 0);
        const points = [startPoint];
        for (let i = 1; i < this.numPoints; i++) {
            const point = points[i - 1];
            points.push(point.rotate(angle));
        }
        return points;
    }
    generateTriangles(innerPoints, outerPoints) {
        const triangles = [];
        const numPoints = innerPoints.length;
        for (let i = 0; i < numPoints; i++) {
            const nextI = (i + 1) % numPoints;
            triangles.push(new triangle_1.default(this.position, outerPoints[i], innerPoints[i]));
            triangles.push(new triangle_1.default(this.position, outerPoints[i], innerPoints[nextI]));
        }
        return triangles;
    }
}
exports.default = Star;

},{"./angle":1,"./point":4,"./triangle":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Triangle {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}
exports.default = Triangle;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbmdsZS50cyIsImJvYXJkLnRzIiwiaW5kZXgudHMiLCJwb2ludC50cyIsInJhZGlhbi50cyIsInN0YXIudHMiLCJ0cmlhbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsc0RBQTZCO0FBQzdCLE1BQXFCLEtBQUs7SUFHeEIsWUFBYSxLQUFhO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQy9DLENBQUM7Q0FDRjtBQVZELHdCQVVDOzs7Ozs7OztBQ1hELG9EQUE2QjtBQUM3QiwwREFBaUM7QUFLakMsTUFBTSxLQUFLO0lBS1QsWUFBYSxPQUFpQyxFQUFFLEtBQWEsRUFBRSxNQUFjO1FBQzNFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3hCLENBQUM7SUFFRCxJQUFJLENBQUUsS0FBYztRQUNsQixPQUFPLElBQUksZUFBTyxDQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUMxQixDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQzdCLENBQUE7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFFLElBQWEsRUFBRSxFQUFXO1FBQ2xDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxVQUFVLENBQUUsTUFBZSxFQUFFLE1BQWM7UUFDekMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDbEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0lBRUQsVUFBVSxDQUFFLE1BQWUsRUFBRSxNQUFjLEVBQUUsUUFBZSxPQUFPO1FBQ2pFLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2xGLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxZQUFZLENBQUUsUUFBa0I7UUFDOUIsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLGtCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM3RyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDdkIsQ0FBQztJQUVELFlBQVksQ0FBRSxRQUFrQixFQUFFLFFBQWUsT0FBTztRQUN0RCxNQUFNLG1CQUFtQixHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMs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QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBSYWRpYW4gZnJvbSAnLi9yYWRpYW4nXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmdsZSB7XG4gIHZhbHVlOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvciAodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB9XG5cbiAgdG9SYWRpYW4gKCk6IFJhZGlhbiB7XG4gICAgcmV0dXJuIG5ldyBSYWRpYW4odGhpcy52YWx1ZSAqIE1hdGguUEkgLyAxODApXG4gIH1cbn1cbiIsImltcG9ydCBQb2ludDJEIGZyb20gJy4vcG9pbnQnXG5pbXBvcnQgVHJpYW5nbGUgZnJvbSAnLi90cmlhbmdsZSdcbmltcG9ydCBTdGFyIGZyb20gJy4vc3RhcidcblxudHlwZSBDb2xvciA9IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVyblxuXG5jbGFzcyBCb2FyZCB7XG4gIHdpZHRoOiBudW1iZXJcbiAgaGVpZ2h0OiBudW1iZXJcbiAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXG5cbiAgY29uc3RydWN0b3IgKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgfVxuXG4gIHRvWFkgKHBvaW50OiBQb2ludDJEKTogUG9pbnQyRCB7XG4gICAgcmV0dXJuIG5ldyBQb2ludDJEKFxuICAgICAgcG9pbnQueCArIHRoaXMud2lkdGggLyAyLjAsXG4gICAgICAtcG9pbnQueSArIHRoaXMuaGVpZ2h0IC8gMi4wXG4gICAgKVxuICB9XG5cbiAgZHJhd0xpbmUgKGZyb206IFBvaW50MkQsIHRvOiBQb2ludDJEKTogdm9pZCB7XG4gICAgY29uc3QgZnJvbVRyYW5zZm9ybWVkID0gdGhpcy50b1hZKGZyb20pXG4gICAgY29uc3QgdG9UcmFuc2Zvcm1lZCA9IHRoaXMudG9YWSh0bylcbiAgICB0aGlzLmNvbnRleHQubW92ZVRvKGZyb21UcmFuc2Zvcm1lZC54LCBmcm9tVHJhbnNmb3JtZWQueSlcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKHRvVHJhbnNmb3JtZWQueCwgdG9UcmFuc2Zvcm1lZC55KVxuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKVxuICB9XG5cbiAgZHJhd0NpcmNsZSAoY2VudGVyOiBQb2ludDJELCByYWRpdXM6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGNlbnRlclRyYW5zZm9ybWVkID0gdGhpcy50b1hZKGNlbnRlcilcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKClcbiAgICB0aGlzLmNvbnRleHQuYXJjKGNlbnRlclRyYW5zZm9ybWVkLngsIGNlbnRlclRyYW5zZm9ybWVkLnksIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpXG4gIH1cblxuICBmaWxsQ2lyY2xlIChjZW50ZXI6IFBvaW50MkQsIHJhZGl1czogbnVtYmVyLCBjb2xvcjogQ29sb3IgPSAnYmxhY2snKTogdm9pZCB7XG4gICAgY29uc3QgY2VudGVyVHJhbnNmb3JtZWQgPSB0aGlzLnRvWFkoY2VudGVyKVxuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKVxuICAgIHRoaXMuY29udGV4dC5hcmMoY2VudGVyVHJhbnNmb3JtZWQueCwgY2VudGVyVHJhbnNmb3JtZWQueSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSlcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JcbiAgICB0aGlzLmNvbnRleHQuZmlsbCgpXG4gIH1cblxuICBkcmF3VHJpYW5nbGUgKHRyaWFuZ2xlOiBUcmlhbmdsZSk6IHZvaWQge1xuICAgIGNvbnN0IHRyaWFuZ2xlVHJhbnNmb3JtZWQgPSBuZXcgVHJpYW5nbGUodGhpcy50b1hZKHRyaWFuZ2xlLmEpLCB0aGlzLnRvWFkodHJpYW5nbGUuYiksIHRoaXMudG9YWSh0cmlhbmdsZS5jKSlcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKClcbiAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRyaWFuZ2xlVHJhbnNmb3JtZWQuYS54LCB0cmlhbmdsZVRyYW5zZm9ybWVkLmEueSlcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKHRyaWFuZ2xlVHJhbnNmb3JtZWQuYi54LCB0cmlhbmdsZVRyYW5zZm9ybWVkLmIueSlcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKHRyaWFuZ2xlVHJhbnNmb3JtZWQuYy54LCB0cmlhbmdsZVRyYW5zZm9ybWVkLmMueSlcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKHRyaWFuZ2xlVHJhbnNmb3JtZWQuYS54LCB0cmlhbmdsZVRyYW5zZm9ybWVkLmEueSlcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKClcbiAgfVxuXG4gIGZpbGxUcmlhbmdsZSAodHJpYW5nbGU6IFRyaWFuZ2xlLCBjb2xvcjogQ29sb3IgPSAnYmxhY2snKTogdm9pZCB7XG4gICAgY29uc3QgdHJpYW5nbGVUcmFuc2Zvcm1lZCA9IG5ldyBUcmlhbmdsZSh0aGlzLnRvWFkodHJpYW5nbGUuYSksIHRoaXMudG9YWSh0cmlhbmdsZS5iKSwgdGhpcy50b1hZKHRyaWFuZ2xlLmMpKVxuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKVxuICAgIHRoaXMuY29udGV4dC5tb3ZlVG8odHJpYW5nbGVUcmFuc2Zvcm1lZC5hLngsIHRyaWFuZ2xlVHJhbnNmb3JtZWQuYS55KVxuICAgIHRoaXMuY29udGV4dC5saW5lVG8odHJpYW5nbGVUcmFuc2Zvcm1lZC5iLngsIHRyaWFuZ2xlVHJhbnNmb3JtZWQuYi55KVxuICAgIHRoaXMuY29udGV4dC5saW5lVG8odHJpYW5nbGVUcmFuc2Zvcm1lZC5jLngsIHRyaWFuZ2xlVHJhbnNmb3JtZWQuYy55KVxuICAgIHRoaXMuY29udGV4dC5saW5lVG8odHJpYW5nbGVUcmFuc2Zvcm1lZC5hLngsIHRyaWFuZ2xlVHJhbnNmb3JtZWQuYS55KVxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBjb2xvclxuICAgIHRoaXMuY29udGV4dC5maWxsKClcbiAgfVxuXG4gIGRyYXdQb2ludCAocG9pbnQ6IFBvaW50MkQsIHJhZGl1cyA9IDIpOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaXJjbGUocG9pbnQsIHJhZGl1cylcbiAgfVxuXG4gIGZpbGxQb2ludCAocG9pbnQ6IFBvaW50MkQsIHJhZGl1cyA9IDIsIGNvbG9yOiBDb2xvciA9ICdibGFjaycpOiB2b2lkIHtcbiAgICB0aGlzLmZpbGxDaXJjbGUocG9pbnQsIHJhZGl1cywgY29sb3IpXG4gIH1cblxuICBkcmF3U3RhciAoc3RhcjogU3Rhcik6IHZvaWQge1xuICAgIGZvciAoY29uc3QgdHJpYW5nbGUgb2Ygc3Rhci50cmlhbmdsZXMpIHtcbiAgICAgIHRoaXMuZHJhd1RyaWFuZ2xlKHRyaWFuZ2xlKVxuICAgIH1cbiAgfVxuXG4gIGZpbGxTdGFyIChzdGFyOiBTdGFyLCBjb2xvcnM6IENvbG9yW10gPSBbJ3JlZCcsICdibGFjayddKTogdm9pZCB7XG4gICAgbGV0IHBvcyA9IC0xXG5cbiAgICBjb25zdCBuZXh0Q29sb3IgPSAoKSA9PiB7XG4gICAgICBwb3MgPSAocG9zICsgMSkgJSBjb2xvcnMubGVuZ3RoXG4gICAgICByZXR1cm4gY29sb3JzW3Bvc11cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHRyaWFuZ2xlIG9mIHN0YXIudHJpYW5nbGVzKSB7XG4gICAgICBjb25zdCBjb2xvciA9IG5leHRDb2xvcigpXG4gICAgICB0aGlzLmZpbGxUcmlhbmdsZSh0cmlhbmdsZSwgY29sb3IpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkXG4iLCJpbXBvcnQgQm9hcmQgZnJvbSAnLi9ib2FyZCdcbmltcG9ydCBTdGFyIGZyb20gJy4vc3RhcidcbmltcG9ydCBQb2ludDJEIGZyb20gJy4vcG9pbnQnXG5cbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm9vdCcpIGFzIEhUTUxEaXZFbGVtZW50XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4J1xuY29udGFpbmVyLnN0eWxlLmZsZXhXcmFwID0gJ3dyYXAnXG5cbnJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuXG5jb25zdCBzdGFyU2l6ZSA9IDIwMFxuY29uc3QgdG90YWxQb2ludHMgPSAzMFxuXG5mb3IgKGxldCBpID0gMTsgaSA8PSB0b3RhbFBvaW50czsgaSsrKSB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gIGNhbnZhcy53aWR0aCA9IHN0YXJTaXplXG4gIGNhbnZhcy5oZWlnaHQgPSBzdGFyU2l6ZVxuXG4gIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpXG4gIHRleHQuaW5uZXJIVE1MID0gYCR7aX0gcG9pbnRzYFxuICB0ZXh0LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInXG5cbiAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNhcmQuc3R5bGUubWFyZ2luID0gJzJweCdcbiAgY2FyZC5hcHBlbmRDaGlsZCh0ZXh0KVxuICBjYXJkLmFwcGVuZENoaWxkKGNhbnZhcylcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZClcblxuICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgaWYgKGNvbnRleHQgIT09IG51bGwpIHtcbiAgICBjb25zdCBib2FyZCA9IG5ldyBCb2FyZChjb250ZXh0LCBzdGFyU2l6ZSwgc3RhclNpemUpXG4gICAgY29uc3Qgc3RhciA9IG5ldyBTdGFyKG5ldyBQb2ludDJEKDAsIDApLCAyMDAsIGkpXG5cbiAgICBib2FyZC5maWxsU3RhcihzdGFyKVxuICB9XG59XG4iLCJpbXBvcnQgQW5nbGUgZnJvbSAnLi9hbmdsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnQyRCB7XG4gIHg6IG51bWJlclxuICB5OiBudW1iZXJcblxuICBjb25zdHJ1Y3RvciAoeDogbnVtYmVyLCB5Om51bWJlcikge1xuICAgIHRoaXMueCA9IHhcbiAgICB0aGlzLnkgPSB5XG4gIH1cblxuICByb3RhdGUgKGFuZ2xlOiBBbmdsZSk6IFBvaW50MkQge1xuICAgIGNvbnN0IHsgdmFsdWUgfSA9IGFuZ2xlLnRvUmFkaWFuKClcbiAgICBjb25zdCByb3RhdGlvbk1hdHJpeCA9IFtcbiAgICAgIFtNYXRoLmNvcyh2YWx1ZSksIC1NYXRoLnNpbih2YWx1ZSldLFxuICAgICAgW01hdGguc2luKHZhbHVlKSwgTWF0aC5jb3ModmFsdWUpXVxuICAgIF1cblxuICAgIC8vIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIHJldHVybiBuZXcgUG9pbnQyRChcbiAgICAgIHRoaXMueCAqIHJvdGF0aW9uTWF0cml4WzBdWzBdICsgdGhpcy55ICogcm90YXRpb25NYXRyaXhbMV1bMF0sXG4gICAgICB0aGlzLnggKiByb3RhdGlvbk1hdHJpeFswXVsxXSArIHRoaXMueSAqIHJvdGF0aW9uTWF0cml4WzFdWzFdXG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgQW5nbGUgZnJvbSAnLi9yYWRpYW4nXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWRpYW4ge1xuICB2YWx1ZTogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IgKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgfVxuXG4gIHRvQW5nbGUgKCk6IEFuZ2xlIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMudmFsdWUgKiAxODAgLyBNYXRoLlBJKVxuICB9XG59XG4iLCJpbXBvcnQgVHJpYW5nbGUgZnJvbSAnLi90cmlhbmdsZSdcbmltcG9ydCBQb2ludDJEIGZyb20gJy4vcG9pbnQnXG5pbXBvcnQgQW5nbGUgZnJvbSAnLi9hbmdsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhciB7XG4gIHRyaWFuZ2xlczogVHJpYW5nbGVbXSA9IFtdXG4gIHNpemU6IG51bWJlclxuICBwb3NpdGlvbjogUG9pbnQyRFxuICBudW1Qb2ludHM6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yIChwb3NpdGlvbjogUG9pbnQyRCwgc2l6ZTogbnVtYmVyLCBudW1Qb2ludHM6IG51bWJlciA9IDUpIHtcbiAgICB0aGlzLnNpemUgPSBzaXplXG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uXG4gICAgdGhpcy5udW1Qb2ludHMgPSBudW1Qb2ludHNcbiAgICB0aGlzLmdlbmVyYXRlU3RhcigpXG4gIH1cblxuICBnZW5lcmF0ZVN0YXIgKCk6IHZvaWQge1xuICAgIGNvbnN0IGNpcmNsZU91dFJhZGl1cyA9IHRoaXMuc2l6ZSAvIDJcbiAgICBjb25zdCBjaXJjbGVJblJhZGl1cyA9IGNpcmNsZU91dFJhZGl1cyAvIDJcblxuICAgIGNvbnN0IGlubmVyUG9pbnRzID0gdGhpcy5nZW5lcmF0ZUNpcmNsZVBvaW50cyhjaXJjbGVJblJhZGl1cylcbiAgICBjb25zdCBvdXRlclBvaW50cyA9IHRoaXMuZ2VuZXJhdGVDaXJjbGVQb2ludHMoXG4gICAgICBjaXJjbGVPdXRSYWRpdXNcbiAgICApLm1hcChwb2ludCA9PiBwb2ludC5yb3RhdGUobmV3IEFuZ2xlKDM2MCAvIHRoaXMubnVtUG9pbnRzIC8gMikpKVxuXG4gICAgdGhpcy50cmlhbmdsZXMgPSB0aGlzLmdlbmVyYXRlVHJpYW5nbGVzKGlubmVyUG9pbnRzLCBvdXRlclBvaW50cylcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDaXJjbGVQb2ludHMgKHJhZGl1czogbnVtYmVyKTogUG9pbnQyRFtdIHtcbiAgICBjb25zdCBhbmdsZSA9IG5ldyBBbmdsZSgzNjAuMCAvIHRoaXMubnVtUG9pbnRzKVxuICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSBuZXcgUG9pbnQyRChyYWRpdXMsIDApXG4gICAgY29uc3QgcG9pbnRzID0gW3N0YXJ0UG9pbnRdXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLm51bVBvaW50czsgaSsrKSB7XG4gICAgICBjb25zdCBwb2ludCA9IHBvaW50c1tpIC0gMV1cbiAgICAgIHBvaW50cy5wdXNoKHBvaW50LnJvdGF0ZShhbmdsZSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBvaW50c1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZVRyaWFuZ2xlcyAoaW5uZXJQb2ludHM6IFBvaW50MkRbXSwgb3V0ZXJQb2ludHM6IFBvaW50MkRbXSk6IFRyaWFuZ2xlW10ge1xuICAgIGNvbnN0IHRyaWFuZ2xlczogVHJpYW5nbGVbXSA9IFtdXG4gICAgY29uc3QgbnVtUG9pbnRzID0gaW5uZXJQb2ludHMubGVuZ3RoXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xuICAgICAgY29uc3QgbmV4dEkgPSAoaSArIDEpICUgbnVtUG9pbnRzXG5cbiAgICAgIHRyaWFuZ2xlcy5wdXNoKG5ldyBUcmlhbmdsZSh0aGlzLnBvc2l0aW9uLCBvdXRlclBvaW50c1tpXSwgaW5uZXJQb2ludHNbaV0pKVxuICAgICAgdHJpYW5nbGVzLnB1c2gobmV3IFRyaWFuZ2xlKHRoaXMucG9zaXRpb24sIG91dGVyUG9pbnRzW2ldLCBpbm5lclBvaW50c1tuZXh0SV0pKVxuICAgIH1cblxuICAgIHJldHVybiB0cmlhbmdsZXNcbiAgfVxufVxuIiwiaW1wb3J0IFBvaW50MkQgZnJvbSAnLi9wb2ludCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJpYW5nbGUge1xuICBiOiBQb2ludDJEXG4gIGE6IFBvaW50MkRcbiAgYzogUG9pbnQyRFxuXG4gIGNvbnN0cnVjdG9yIChhOiBQb2ludDJELCBiOiBQb2ludDJELCBjOiBQb2ludDJEKSB7XG4gICAgdGhpcy5hID0gYVxuICAgIHRoaXMuYiA9IGJcbiAgICB0aGlzLmMgPSBjXG4gIH1cbn1cbiJdfQ==
