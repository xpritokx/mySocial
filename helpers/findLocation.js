module.exports = function (fA, fB, lA, lB) {
    //fA -> latitude user A
    //fB -> latitude user B
    //lA -> longitude user A
    //fB -> longitude user B

    var r = 6371; //earth radius
    var d = Math.acos(Math.sin(fA) * Math.sin(fB) + Math.cos(fA) * Math.cos(fB) * Math.cos(lA - lB)); //distance

    //computing distance on the earth
    return ((r * d) / 10).toFixed(4) + " km";
};