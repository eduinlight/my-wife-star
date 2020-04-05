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