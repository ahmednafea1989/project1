$(document).ready(function () {
    var divEL;
    var liEL ;
   
        
        
        
        var $search = $("#button");
        
       
      
        
        
        
        $search.on("click", function (e) {
            e.preventDefault();
            getLocation();
            
           
            
            
            
            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
                
            }   
            function showPosition(position) {
               
                
                
                var berkeley = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                
                var service = new google.maps.places.PlacesService(map);
                
                
                var request = {
                    location: berkeley,
                    radius: '5000',
                    type: ['gas_station'],
                    openNow: true
                };
                
                service.nearbySearch(request, function (results, status) {
                    console.log(results);
                    console.log(status);
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                            
                            
                           
                            var divEL1=$("<div>");
                            divEL1.addClass("showResult");
                           

                            
                            var p1 = $("<p>");
                            
                            p1.addClass("name");
                            p1.text(results[i].name);
                            divEL1.append(p1);
                            var h4El = $("<h4>");
                            h4El.addClass("rating");
                            h4El.text("Rating:"+results[i].rating);
                            divEL1.append(h4El);
                            var p2 = $("<p>");
                            p2.addClass("address");
                            p2.text(results[i]. vicinity);
                            divEL1.append(p2);
                            $("#page1").append(divEL1);
                            var hEl5 = $("<h5>");
                            hEl5.addClass("services1");
                            hEl5.text("Services:");
                            divEL1.append(hEl5);
                            

                            
                       
                            
                            
                            
                           var typeEl = results[i].types;
                            for(j=0;j<typeEl.length;j++){
                                divEL=$("<div>");
                                liEL = $("<li>");
                                liEL.addClass("service");
                                liEL.text(typeEl[j]);
                                divEL.append(liEL);
                                divEL1.append(divEL);
                                
                            }
                            
                            
                            
                        
                        var hrEl = $("<hr>");
                        $("#page1").append(hrEl);
                        

                        

                    }
                    map.setCenter(results[0].geometry.location);
                }
            });

        }



       









    })

})
