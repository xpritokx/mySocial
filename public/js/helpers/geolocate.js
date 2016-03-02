function geo () {
    var navInfo;
    var noGeolocation = function () {
        alert('for some reason we are unable to find location. Sorry.');
    };

    if (!navigator.geolocation) {
        noGeolocation();
    } else {
        navigator.geolocation.getCurrentPosition(function (p) {
            console.log('latitude = ', p.coords.latitude);
            console.log('longituge = ', p.coords.longitude);
            navInfo = {
                latitude: p.coords.latitude,
                longitude: p.coords.longitude
            };

        }, function (err) {
            noGeolocation();
        });
    }
}