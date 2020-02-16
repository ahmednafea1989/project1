$(document).ready(function() {

    const $search = $("#button");
    const currentRadius = $("#radius").val();
    const currentService = $("#service").val();
    const $answerList = $("#answerList")
        //alert(currentService);

    function showPosition(position) {
        var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var service = new google.maps.places.PlacesService(map);
        var request = {
            location: currentPosition,
            radius: currentRadius,
            type: [currentService],
            openNow: false
        };


        service.nearbySearch(request, function(results, status) {

            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    // console.log("results  " + results[i].name);
                    $li = $("<li>");
                    $li.text(`${results[i].name} `);
                    $answerList.append($li);
                }
                map.setCenter(results[0].geometry.location);
            }
        });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    $search.on("click", function(e) {
        e.preventDefault();
        getLocation();
    })
})