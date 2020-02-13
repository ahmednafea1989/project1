var showLocation = $("#showLocation");

function getLocation() { 
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    showLocation.html("Geolocation is not supported by this browser.");
  }
}
  function showPosition(position) {
    showLocation.html("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude);
}
$("#searchBtn").on("click", function(e){
    e.preventDefault();
   getLocation();
   showPosition();
})