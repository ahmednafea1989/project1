$(document).ready(function() {

    const $search = $("#button");
    let radius = "";
    let service = "";
    const $answerList = $("#answerList");
    let address = "";
    let city = "";
    let state = "";
    let zip = "";
    let markerPlaces = [];


    function createMarker(place, markerNumber) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            //title: markerNumber,
            icon: place.icon
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(`${markerNumber}: Name: ${place.name} Address: ${place.vicinity}`);
            infowindow.open(map, this);
        });
    }

    $(document).on("click", ".inList", function(e) {
        e.preventDefault();
        const i = parseInt($(this).attr("id"));
        map.setCenter(markerPlaces[i].geometry.location);
    });

    function showCurrentPosition(currentPosition) {
        var placeService = new google.maps.places.PlacesService(map);
        var request = {
            location: currentPosition,
            radius: radius,
            type: [service],
            openNow: false
        };
        placeService.nearbySearch(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                $answerList.empty();
                markerPlaces = [];
                for (let i = 0; i < results.length; i++) {
                    const markerNumber = i + 1;
                    createMarker(results[i], markerNumber);
                    $li = $("<li>");
                    $answerList.append($li);
                    const $btn = $("<button>");
                    $li.append($btn);
                    $btn.addClass("inList");
                    $btn.attr("id", markerNumber);
                    $btn.text(`${markerNumber}: ${results[i].name} Address: ${results[i].vicinity}`);
                    $btn.css("text-align", "left")
                    $btn.css("background-color", "white");
                    $btn.css("color", "black");
                    $btn.css("height", "20px");
                    $btn.css("width", "100%");
                    markerPlaces.push(results[i]);
                }
                map.setCenter(results[0].geometry.location);
            } else {
                alert(`Data request failed: contact developer with error code ${status}`);
            }
        });
    }

    function showPositionByLatLon(lat, lon) {
        var currentPosition = new google.maps.LatLng(lat, lon);
        showCurrentPosition(currentPosition);
    }

    function getLonLat(filter) {
        //       alert(filter);
        $.ajax({
            url: queryUrl(filter),
            method: "GET"
        }).then(function(response) {
            showPositionByLatLon(response[0].lat, response[0].lon)
        })
    }

    // function getLonLat(filter) {
    //     $.ajax({
    //         url: queryUrl(filter),
    //         method: "GET"
    //     }).then(function(response) {
    //         alert(response.status);
    //         if (response.status === 200) {
    //             showPositionByLatLon(response[0].lat, response[0].lon);
    //         } else {
    //             alert(`Data request failed: contact developer with error code ${response.status} {response.statusText}`);
    //         }
    //     })
    // }

    function queryUrl(filter) {
        return `https://us1.locationiq.com/v1/search.php?key=d54f4fa47e6c4c&${filter}&format=json`;
    };

    function filterOf(name, item) {
        if (item === "") {
            return "";
        } else {
            return `${name}=${item}`
        }
    }

    function createFilter() {
        let filterArray = [];
        filterArray.push(filterOf(`address`, address));
        filterArray.push(filterOf(`city`, city));
        filterArray.push(filterOf(`statecode`, state));
        filterArray.push(filterOf(`postalcode`, zip));
        let filter = '';
        for (let i = 0; i < filterArray.length; i++) {
            if (filter != "" && filterArray[i] != "") {
                filter += "&";
            }
            filter += filterArray[i];
        }
        return filter;
    }


    function showPosition(position) {
        let currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        showCurrentPosition(currentPosition);
    }

    function getResultsByCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function getResultsByAddress() {
        const filter = createFilter();
        getLonLat(filter);
    }

    function setLocalStorage() {
        localStorage.setItem('address', address);
        localStorage.setItem('city', city);
        localStorage.setItem('state', state);
        localStorage.setItem('zip', zip);
        localStorage.setItem('radius', radius);
        localStorage.setItem('service', service);
    }

    function getLocalStorage() {
        $("#address").val(localStorage.getItem('address'));
        $("#city").val(localStorage.getItem('city'));
        $("#state").val(localStorage.getItem('state'));
        $("#zip").val(localStorage.getItem('zip'));

        const radius = localStorage.getItem('radius');

        if (radius === "" || radius === null) {
            $("#radius").val("2000");
        } else {
            $("#radius").val(radius);
        }

        const service = localStorage.getItem('service');

        if (service === "" || service === null) {
            $("#service").val("gas_service");
        } else {
            $("#service").val(service);
        }
    }

    $search.on("click", function(e) {
        e.preventDefault();

        address = $("#address").val();
        city = $("#city").val();
        state = $("#state").val();
        zip = $("#zip").val();
        radius = $("#radius").val();
        service = $("#service").val();

        setLocalStorage();

        if (address === "" && city === "" && state === "" && zip === "") {
            getResultsByCurrentLocation()
        } else getResultsByAddress();

    })


    getLocalStorage();
})