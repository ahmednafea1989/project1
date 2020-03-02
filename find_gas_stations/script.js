$(document).ready(function() {

    const $search = $('#button');
    const $page1 = $('#page1');
    const minimumHeight = 400;
    const maximumHeight = window.innerHeight;
    const $mapColumn = $('#map');

    function getGasLocation() {
        getLocation();

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        }

        function setMapColumnHeight() {
            let height = $page1.height() > minimumHeight ? $page1.height() : minimumHeight;
            if (height > maximumHeight) {
                height = maximumHeight;
            }
            $mapColumn.height(height);
        }

        function showPosition(position) {
            const currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            const service = new google.maps.places.PlacesService(map);
            const request = {
                location: currentLocation,
                radius: '5000',
                type: ['gas_station'],
                openNow: true
            };
            service.nearbySearch(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                        const divEL1 = $('<div>');
                        divEL1.addClass('showResult');
                        const p1 = $('<p>');
                        p1.addClass('name');
                        p1.text(results[i].name);
                        divEL1.append(p1);
                        const h4El = $('<h4>');
                        h4El.addClass('rating');
                        h4El.text('Rating:' + results[i].rating);
                        divEL1.append(h4El);
                        const p2 = $('<p>');
                        p2.addClass('address');
                        p2.text(results[i].vicinity);
                        divEL1.append(p2);
                        $('#page1').append(divEL1);
                        const hEl5 = $('<h5>');
                        hEl5.addClass('services1');
                        hEl5.text('Services:');
                        divEL1.append(hEl5);
                        const typeEl = results[i].types;
                        for (j = 0; j < typeEl.length; j++) {
                            divEL = $('<div>');
                            liEL = $('<li>');
                            liEL.addClass('service');
                            liEL.text(typeEl[j]);
                            divEL.append(liEL);
                            divEL1.append(divEL);
                        }
                        const hrEl = $('<hr>');
                        $('#page1').append(hrEl);
                    };
                    map.setCenter(currentLocation);
                    setMapColumnHeight();
                };
            });
        };
    };
    getGasLocation();
})