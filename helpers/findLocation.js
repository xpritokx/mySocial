module.exports = function (fA, fB, lA, lB) {
    //fA -> latitude user A
    //fB -> latitude user B
    //lA -> longitude user A
    //fB -> longitude user B

    //var r = 6371; //earth radius
    var r = 111.2; //length of line earth
    //var d = Math.acos(Math.sin(fA) * Math.sin(fB) + Math.cos(fA) * Math.cos(fB) * Math.cos(lA - lB)); //distance

    var d = Math.sqrt((lA - lB) * (lA - lB) + (fA - fB) * Math.cos(Math.PI * lA/180) * (fA - fB) * Math.cos(Math.PI * lA/180));

    //computing distance on the earth
    return ((r * d)).toFixed(4) + ' km';
};