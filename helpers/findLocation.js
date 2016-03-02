/**
 * Created by Pritok on 02.03.2016.
 */
module.exports = function (fA, fB, lA, lB) {
    console.log(fA, fB, lA, lB);
    var r = 6371; //earth radius
    var d = Math.acos(Math.sin(fA) * Math.sin(fB) + Math.cos(fA) * Math.cos(fB) * Math.cos(lA - lB)); //distance

    return ((r * d) / 10).toFixed(4) + " km";
};