/**
 * Created by Pritok on 16.02.2016.
 */
function inherits(Child, Parent){
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
}

module.exports = inherits;