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