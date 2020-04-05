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