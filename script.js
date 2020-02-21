$(document).ready(function() {

    const $search = $("#button");
    let radius = "";
    let serviceType = "";
    const $answerList = $("#answerList");
    let address = "";
    let city = "";
    let state = "";
    let zip = "";
    let markerPlaces = [];


    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: place.icon
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(`Name: ${place.name} Address: ${place.vicinity}`);
            infowindow.open(map, this);
        });
    }

    $(document).on("click", ".inList", function() {
        const i = parseInt($(this).attr("id"));
        //   debugger
        //alert(i);
        //map.setCenter(markerPlaces[i].geometry.location);
        regenrateMap(marketPlaces[i].location);
    });

    function showCurrentPosition(currentPosition, generateList) {
        //    debugger
        var service = new google.maps.places.PlacesService(map);
        var request = {
            location: currentPosition,
            radius: radius,
            type: [serviceType],
            openNow: false
        };
        service.nearbySearch(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                if (generateList) {
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                        $li = $("<li>");
                        $answerList.append($li);
                        const $btn = $("<button>");
                        $li.append($btn);
                        $btn.addClass("inList");
                        $btn.attr("id", i);
                        $btn.text(`${results[i].name} Address: ${results[i].vicinity}`);
                        $btn.css("background-color", "white");
                        $btn.css("color", "black");
                        $btn.css("height", "20px");
                        $btn.css("width", "100%");
                        markerPlaces.push(results[i]);
                    }
                }
                map.setCenter(results[0].geometry.location);
            }
        });
    }

    function showPositionByLatLon(lat, lon) {
        var currentPosition = new google.maps.LatLng(lat, lon);
        showCurrentPosition(currentPosition, true);
    }

    function getLonLat(filter) {
        $.ajax({
            url: queryUrl(filter),
            method: "GET"
        }).then(function(response) {
            showPositionByLatLon(response[0].lat, response[0].lon)
        })
    }

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

    function regenrateMap(position) {
        //  alert(position);
        //  debugger
        var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        showCurrentPosition(currentPosition, false);
    }

    function showPosition(position) {
        var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        showCurrentPosition(currentPosition, true);
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
        localStorage.setItem('service', serviceType);
    }

    function getLocalStorage() {
        $("#address").text = localStorage.getItem('address');
        $("#city").text = localStorage.getItem('city');
        $("#state").text = localStorage.getItem('state');
        $("#zip").text = localStorage.getItem('zip');
        $("#radius").text = localStorage.getItem('radius');
        $("#service").text = localStorage.getItem('serviceType');
    }

    $search.on("click", function(e) {
        e.preventDefault();
        $answerList.empty();
        markerPlaces = [];
        address = $("#address").val();
        city = $("#city").val();
        state = $("#state").val();
        zip = $("#zip").val();
        radius = $("#radius").val();
        serviceType = $("#service").val();

        setLocalStorage();

        if (address === "" && city === "" && state === "" && zip === "") {
            getResultsByCurrentLocation()
        } else getResultsByAddress();

    })


    getLocalStorage();
})