



function initMap() {


    
    var berkeley = new google.maps.LatLng(37.86459674936833,-122.25641501017701 );
    infowindow = new google.maps.InfoWindow();
    console.log(infowindow)
    map = new google.maps.Map(
      document.getElementById('map'), { center: berkeley, zoom: 15 });


  }

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }