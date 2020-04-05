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