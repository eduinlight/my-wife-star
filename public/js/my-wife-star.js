System.register("radian", ["radian"], function (exports_1, context_1) {
    "use strict";
    var radian_1, Radian;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (radian_1_1) {
                radian_1 = radian_1_1;
            }
        ],
        execute: function () {
            Radian = class Radian {
                constructor(value) {
                    this.value = value;
                }
                toAngle() {
                    return new radian_1.default(this.value * 180 / Math.PI);
                }
            };
            exports_1("default", Radian);
        }
    };
});
System.register("angle", ["radian"], function (exports_2, context_2) {
    "use strict";
    var radian_2, Angle;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (radian_2_1) {
                radian_2 = radian_2_1;
            }
        ],
        execute: function () {
            Angle = class Angle {
                constructor(value) {
                    this.value = value;
                }
                toRadian() {
                    return new radian_2.default(this.value * Math.PI / 180);
                }
            };
            exports_2("default", Angle);
        }
    };
});
System.register("point", [], function (exports_3, context_3) {
    "use strict";
    var Point2D;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Point2D = class Point2D {
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
            };
            exports_3("default", Point2D);
        }
    };
});
System.register("triangle", [], function (exports_4, context_4) {
    "use strict";
    var Triangle;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            Triangle = class Triangle {
                constructor(a, b, c) {
                    this.a = a;
                    this.b = b;
                    this.c = c;
                }
            };
            exports_4("default", Triangle);
        }
    };
});
System.register("star", ["triangle", "point", "angle"], function (exports_5, context_5) {
    "use strict";
    var triangle_1, point_1, angle_1, Star;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (triangle_1_1) {
                triangle_1 = triangle_1_1;
            },
            function (point_1_1) {
                point_1 = point_1_1;
            },
            function (angle_1_1) {
                angle_1 = angle_1_1;
            }
        ],
        execute: function () {
            Star = class Star {
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
            };
            exports_5("default", Star);
        }
    };
});
System.register("board", [], function (exports_6, context_6) {
    "use strict";
    var Board;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Board = class Board {
                constructor(context, width, height) {
                    this.width = width;
                    this.height = height;
                    this.context = context;
                    this.configure();
                }
                configure() {
                    this.context.translate(this.width / 2.0, this.height / 2.0);
                }
                drawLine(from, to) {
                    this.context.moveTo(from.x, from.y);
                    this.context.lineTo(to.x, to.y);
                    this.context.stroke();
                }
                drawCircle(center, radius) {
                    this.context.beginPath();
                    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                    this.context.stroke();
                }
                fillCircle(center, radius, color = 'black') {
                    this.context.beginPath();
                    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                    this.context.fillStyle = color;
                    this.context.fill();
                }
                drawTriangle(triangle) {
                    this.context.beginPath();
                    this.context.moveTo(triangle.a.x, triangle.a.y);
                    this.context.lineTo(triangle.b.x, triangle.b.y);
                    this.context.lineTo(triangle.c.x, triangle.c.y);
                    this.context.lineTo(triangle.a.x, triangle.a.y);
                    this.context.stroke();
                }
                fillTriangle(triangle, color = 'black') {
                    this.context.beginPath();
                    this.context.moveTo(triangle.a.x, triangle.a.y);
                    this.context.lineTo(triangle.b.x, triangle.b.y);
                    this.context.lineTo(triangle.c.x, triangle.c.y);
                    this.context.lineTo(triangle.a.x, triangle.a.y);
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
            };
            exports_6("default", Board);
        }
    };
});
System.register("index", ["board", "star", "point"], function (exports_7, context_7) {
    "use strict";
    var board_1, star_1, point_2, root, container, starSize, totalPoints;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (board_1_1) {
                board_1 = board_1_1;
            },
            function (star_1_1) {
                star_1 = star_1_1;
            },
            function (point_2_1) {
                point_2 = point_2_1;
            }
        ],
        execute: function () {
            root = document.querySelector('#root');
            container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            root.appendChild(container);
            starSize = 200;
            totalPoints = 30;
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
                    const star = new star_1.default(new point_2.default(0, 0), 200, i);
                    board.fillStar(star);
                }
                console.log('locasasdad');
            }
        }
    };
});
