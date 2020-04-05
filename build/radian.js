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