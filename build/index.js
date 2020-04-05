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
    console.log('windows');
    var context = canvas.getContext('2d');
    if (context !== null) {
        var board = new board_1.default(context, starSize, starSize);
        var star = new star_1.default(new point_1.default(0, 0), 200, i);
        board.fillStar(star);
    }
}