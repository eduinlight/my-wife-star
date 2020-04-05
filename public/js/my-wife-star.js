(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var radian_1 = __importDefault(require("./radian"));
var Angle = /** @class */ (function () {
    function Angle(value) {
        this.value = value;
    }
    Angle.prototype.toRadian = function () {
        return new radian_1.default(this.value * Math.PI / 180);
    };
    return Angle;
}());
exports.default = Angle;
},{"./radian":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Board = /** @class */ (function () {
    function Board(context, width, height) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.configure();
    }
    Board.prototype.configure = function () {
        this.context.translate(this.width / 2.0, this.height / 2.0);
    };
    Board.prototype.drawLine = function (from, to) {
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
    };
    Board.prototype.drawCircle = function (center, radius) {
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this.context.stroke();
    };
    Board.prototype.fillCircle = function (center, radius, color) {
        if (color === void 0) { color = 'black'; }
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
    };
    Board.prototype.drawTriangle = function (triangle) {
        this.context.beginPath();
        this.context.moveTo(triangle.a.x, triangle.a.y);
        this.context.lineTo(triangle.b.x, triangle.b.y);
        this.context.lineTo(triangle.c.x, triangle.c.y);
        this.context.lineTo(triangle.a.x, triangle.a.y);
        this.context.stroke();
    };
    Board.prototype.fillTriangle = function (triangle, color) {
        if (color === void 0) { color = 'black'; }
        this.context.beginPath();
        this.context.moveTo(triangle.a.x, triangle.a.y);
        this.context.lineTo(triangle.b.x, triangle.b.y);
        this.context.lineTo(triangle.c.x, triangle.c.y);
        this.context.lineTo(triangle.a.x, triangle.a.y);
        this.context.fillStyle = color;
        this.context.fill();
    };
    Board.prototype.drawPoint = function (point, radius) {
        if (radius === void 0) { radius = 2; }
        this.drawCircle(point, radius);
    };
    Board.prototype.fillPoint = function (point, radius, color) {
        if (radius === void 0) { radius = 2; }
        if (color === void 0) { color = 'black'; }
        this.fillCircle(point, radius, color);
    };
    Board.prototype.drawStar = function (star) {
        for (var _i = 0, _a = star.triangles; _i < _a.length; _i++) {
            var triangle = _a[_i];
            this.drawTriangle(triangle);
        }
    };
    Board.prototype.fillStar = function (star, colors) {
        if (colors === void 0) { colors = ['red', 'black']; }
        var pos = -1;
        var nextColor = function () {
            pos = (pos + 1) % colors.length;
            return colors[pos];
        };
        for (var _i = 0, _a = star.triangles; _i < _a.length; _i++) {
            var triangle = _a[_i];
            var color = nextColor();
            this.fillTriangle(triangle, color);
        }
    };
    return Board;
}());
exports.default = Board;
},{}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = __importDefault(require("./board"));
var star_1 = __importDefault(require("./star"));
var point_1 = __importDefault(require("./point"));
var root = document.querySelector('#root');
var container = document.createElement('div');
container.style.display = 'flex';
container.style.flexWrap = 'wrap';
root.appendChild(container);
var starSize = 200;
var totalPoints = 30;
for (var i = 1; i <= totalPoints; i++) {
    var canvas = document.createElement('canvas');
    canvas.width = starSize;
    canvas.height = starSize;
    var text = document.createElement('h5');
    text.innerHTML = i + " point" + (i === 1 ? '' : 's');
    text.style.textAlign = 'center';
    var card = document.createElement('div');
    card.style.margin = '2px';
    card.appendChild(text);
    card.appendChild(canvas);
    container.appendChild(card);
    var context = canvas.getContext('2d');
    if (context !== null) {
        var board = new board_1.default(context, starSize, starSize);
        var star = new star_1.default(new point_1.default(0, 0), 200, i);
        board.fillStar(star);
    }
}
},{"./board":2,"./point":4,"./star":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point2D = /** @class */ (function () {
    function Point2D(x, y) {
        this.x = x;
        this.y = y;
    }
    Point2D.prototype.rotate = function (angle) {
        var value = angle.toRadian().value;
        var rotationMatrix = [
            [Math.cos(value), -Math.sin(value)],
            [Math.sin(value), Math.cos(value)]
        ];
        // matrix multiplication
        return new Point2D(this.x * rotationMatrix[0][0] + this.y * rotationMatrix[1][0], this.x * rotationMatrix[0][1] + this.y * rotationMatrix[1][1]);
    };
    return Point2D;
}());
exports.default = Point2D;
},{}],5:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var radian_1 = __importDefault(require("./radian"));
var Radian = /** @class */ (function () {
    function Radian(value) {
        this.value = value;
    }
    Radian.prototype.toAngle = function () {
        return new radian_1.default(this.value * 180 / Math.PI);
    };
    return Radian;
}());
exports.default = Radian;
},{"./radian":5}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var triangle_1 = __importDefault(require("./triangle"));
var point_1 = __importDefault(require("./point"));
var angle_1 = __importDefault(require("./angle"));
var Star = /** @class */ (function () {
    function Star(position, size, numPoints) {
        if (numPoints === void 0) { numPoints = 5; }
        this.triangles = [];
        this.size = size;
        this.position = position;
        this.numPoints = numPoints;
        this.generateStar();
    }
    Star.prototype.generateStar = function () {
        var _this = this;
        var circleOutRadius = this.size / 2;
        var circleInRadius = circleOutRadius / 2;
        var innerPoints = this.generateCirclePoints(circleInRadius);
        var outerPoints = this.generateCirclePoints(circleOutRadius).map(function (point) { return point.rotate(new angle_1.default(360 / _this.numPoints / 2)); });
        this.triangles = this.generateTriangles(innerPoints, outerPoints);
    };
    Star.prototype.generateCirclePoints = function (radius) {
        var angle = new angle_1.default(360.0 / this.numPoints);
        var startPoint = new point_1.default(radius, 0);
        var points = [startPoint];
        for (var i = 1; i < this.numPoints; i++) {
            var point = points[i - 1];
            points.push(point.rotate(angle));
        }
        return points;
    };
    Star.prototype.generateTriangles = function (innerPoints, outerPoints) {
        var triangles = [];
        var numPoints = innerPoints.length;
        for (var i = 0; i < numPoints; i++) {
            var nextI = (i + 1) % numPoints;
            triangles.push(new triangle_1.default(this.position, outerPoints[i], innerPoints[i]));
            triangles.push(new triangle_1.default(this.position, outerPoints[i], innerPoints[nextI]));
        }
        return triangles;
    };
    return Star;
}());
exports.default = Star;
},{"./angle":1,"./point":4,"./triangle":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Triangle = /** @class */ (function () {
    function Triangle(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    return Triangle;
}());
exports.default = Triangle;
},{}]},{},[3])

//# sourceMappingURL=my-wife-star.js.map
