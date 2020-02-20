$(document).ready(function () {

    const $search = $("#button");
    const currentRadius = $("#radius").val();
    const currentService = $("#service").val();
    const $answerList = $("#answerList");
    const address = $("#address").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zip = $("#zip").val();


    function showCurrentPosition(currentPosition) {
        var service = new google.maps.places.PlacesService(map);
        var request = {
            location: currentPosition,
            radius: currentRadius,
            type: [currentService],
            openNow: false
        };
        service.nearbySearch(request, function (results, status) {
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

    function showPositionByLatLon(lat, lon) {
        var currentPosition = new google.maps.LatLng(lat, lon);
        showCurrentPosition(currentPosition)
    }  

    function getLonLat(filter) {
        $.ajax({
            url: queryUrl(filter),
            method: "GET"
        }).then(function (response) {
            showPositionByLatLon(response[0].lat, response[0].lon)
        })
    }

    function queryUrl(filter) {
        return `https://us1.locationiq.com/v1/search.php?key=d54f4fa47e6c4c&${filter}&format=json`;
    };

    function callApi() {
        let filter = "";
        if (address === "" && city === "" && state === "") {
            filter = `postalcode=${zip}`
        } else if (address === "" && city === "" && zip === "") {
            filter = `statecode=${state}`
        } else if (address === "") {
            if (city === "") {
                filter = `statecode=${state}`
            } else {
                filter = `city=${city}&statecode=${state}`
            }
        } else if (address != "" && city != "" && state != "") {
            filter = `address=${address}&city=${city}&statecode=${state}`
        }
        if (filter === ""){

        } else {
            getLonLat(filter)
        }
    }

    function showPosition(position) {
        var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        showCurrentPosition(currentPosition);
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

   
    $search.on("click", function (e) {
        e.preventDefault();
        if (address === "" && city === "" && state === "" && zip === "") {
            getLocation()
        } else callAPI;
    
    })
})