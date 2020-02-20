$(document).ready(function() {

    const $search = $("#button");
    const currentRadius = $("#radius").val();
    const currentService = $("#service").val();
    const $answerList = $("#answerList");
    let address = "";
    let city = "";
    let state = "";
    let zip = "";


    function showCurrentPosition(currentPosition) {
        var service = new google.maps.places.PlacesService(map);
        var request = {
            location: currentPosition,
            radius: currentRadius,
            type: [currentService],
            openNow: false
        };
        service.nearbySearch(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
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
            if (filter != "") {
                filter += "&";
            }
            filter += filterArray[i];
        }
        alert(filter);
        return filter;
    }


    function showPosition(position) {
        var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
    }

    function getLocalStorage() {
        address = localStorage.getItem('address');
        city = localStorage.getItem('city');
        state = localStorage.getItem('state');
        zip = localStorage.getItem('zip');

    }
    $search.on("click", function(e) {
        e.preventDefault();
        address = $("#address").val();
        city = $("#city").val();
        state = $("#state").val();
        zip = $("#zip").val();
        setLocalStorage();

        if (address === "" && city === "" && state === "" && zip === "") {
            getResultsByCurrentLocation()
        } else getResultsByAddress();

    })
    getLocalStorage();
})