//let map;

$(document).ready(function() {

    const $search = $("#search");
    const $service = $("#service");
    const $answerList = $("#answerList");
    const $formColumn = $("#formColumn");
    const $listColumn = $("#listColumn");
    const $mapColumn = $('#mapColumn');
    const minimumHeight = $formColumn.height();
    let radius = "";
    let service = "";
    let address = "";
    let city = "";
    let state = "";
    let zip = "";
    let markerPlaces = [];
    let markerArray = [];


    function createMarker(place, markerNumber) {
        const image = {
            url: place.icon,
            scaledSize: new google.maps.Size(20, 20)
        };
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: image
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(`${markerNumber}: Name: ${place.name} Address: ${place.vicinity}`);
            infowindow.open(map, this);
        });
        markerArray.push(marker);
    }

    $(document).on("click", ".inList", function(e) {
        e.preventDefault();
        const i = parseInt($(this).attr("id"));
        map.setCenter(markerPlaces[i].geometry.location);
    });

    function addSeviceItem(place, i) {
        const markerNumber = i + 1;
        createMarker(place, markerNumber);
        $li = $("<li>");
        $answerList.append($li);
        const $btn = $("<button>");
        $li.append($btn);
        $btn.addClass("inList");
        $btn.attr("id", markerNumber);
        $btn.text(`${markerNumber}: ${place.name} Address: ${place.vicinity}`);
        $btn.css("text-align", "left")
        $btn.css("background-color", "white");
        $btn.css("color", "black");
        $btn.css("height", "20px");
        $btn.css("width", "100%");
        markerPlaces.push(place);
    }

    function setMapColumnHeight() {
        let height = $listColumn.height() > minimumHeight ? $listColumn.height() : minimumHeight;
        $mapColumn.height(height);
    }

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
                for (let i = 0; i < markerArray.length; i++) {
                    markerArray[i].setMap(null);
                };
                markerPlaces = [];
                for (let i = 0; i < results.length; i++) {
                    addSeviceItem(results[i], i);
                };
                setMapColumnHeight()
                map.setCenter(currentPosition);

                //map.setCenter(results[0].geometry.location);
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
        $.ajax({
            url: queryUrl(filter),
            method: "GET",
            success: function(response) {
                showPositionByLatLon(response[0].lat, response[0].lon)
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(`Search failed for filter: ${filter} Error ${xhr.status}`);
            }
        });
    }

    function queryUrl(filter) {
        return `https://us1.locationiq.com/v1/search.php?key=d54f4fa47e6c4c&${filter}&format=json`;
    };

    function filterOf(name, item) {
        if (item === "" || item === undefined) {
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
                filter = filter + "&";
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

    function noValue(item) {
        return item === "" || item === null || item === undefined;
    }

    $search.on("click", function(e) {
        e.preventDefault();
        address = $("#address").val();
        city = $("#city").val();
        state = $("#state").val();
        zip = $("#zip").val();
        radius = $("#radius").val();
        service = $service.val();
        setLocalStorage();
        $("#foundServices").text(service);
        if (noValue(address) && noValue(city) && noValue(state) && noValue(zip)) {
            getResultsByCurrentLocation()
        } else getResultsByAddress();
    })


    getLocalStorage();


})