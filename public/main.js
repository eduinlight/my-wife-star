"use strict";
var drawBoard = document.querySelector('canvas');
var context = drawBoard.getContext('2d');
var board = {
    width: 200.0,
    height: 200.0
};
var pointRadius = 2;
var rotationMatrix = [
    [function (a) { return Math.cos(a); }, function (a) { return -Math.sin(a); }],
    [function (a) { return Math.sin(a); }, function (a) { return Math.cos(a); }]
];
function angleToRadian(angle) {
    return (angle * Math.PI) / 180;
}
function vectorScalarProduct(vector, scalar) {
    return { x: vector.x * scalar, y: vector.y * scalar };
}
function rotatePoint(point, angle) {
    var radian = angleToRadian(angle);
    var rotationMatrix = [
        [Math.cos(radian), -Math.sin(radian)],
        [Math.sin(radian), Math.cos(radian)]
    ];
    // matrix multiplication
    return {
        x: point.x * rotationMatrix[0][0] + point.y * rotationMatrix[1][0],
        y: point.x * rotationMatrix[0][1] + point.y * rotationMatrix[1][1]
    };
}
function toXY(point) {
    return {
        x: point.x + board.width / 2.0,
        y: -point.y + board.height / 2.0
    };
}
function drawCircle(center, radius) {
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    context.stroke();
}
function drawPoint(point) {
    drawCircle(point, pointRadius);
}
function drawLine(from, to) {
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
}
function drawTriangle(a, b, c, color) {
    if (color === void 0) { color = 'black'; }
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.lineTo(c.x, c.y);
    context.lineTo(a.x, a.y);
    context.fillStyle = color;
    context.fill();
}
var center = { x: 0, y: 0 };
drawPoint(toXY(center));
var circleOutRadius = board.width / 2;
var circleInRadius = circleOutRadius / 2;
drawCircle(toXY(center), circleOutRadius);
drawCircle(toXY(center), circleInRadius);
// draw star
function generateStarPoints(starPoints, radius) {
    var starAngle = 360.0 / starPoints;
    var points = [{ x: radius, y: 0 }];
    for (var i = 1; i <= starPoints; i++) {
        var point = points[i - 1];
        var pointRotated = rotatePoint(point, starAngle);
        points.push(pointRotated);
    }
    return points;
}
function drawStar(starPoints) {
    if (starPoints === void 0) { starPoints = 5; }
    var innerPoints = generateStarPoints(starPoints, circleInRadius);
    var outerPoints = generateStarPoints(starPoints, circleOutRadius).map(function (point) { return rotatePoint(point, 360 / starPoints / 2); });
    // build triangles
    var triangles = [];
    for (var i = 0; i < starPoints; i++) {
        var nextI = (i + 1) % starPoints;
        drawPoint(toXY(outerPoints[i]));
        drawPoint(toXY(innerPoints[i]));
        triangles.push([center, outerPoints[i], innerPoints[i]]);
        triangles.push([center, outerPoints[i], innerPoints[i + 1]]);
    }
    // for (let i = 0 i < triangles.length i++) {
    //   const triangle = triangles[i]
    //   drawTriangle(
    //     toXY(triangle[0]),
    //     toXY(triangle[1]),
    //     toXY(triangle[2]),
    //     i % 2 == 0 ? "red" : "black"
    //   )
    // }
}
drawStar(6);
