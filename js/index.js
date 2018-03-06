// script generated from google API
var map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 11,
        gestureHandling: 'greedy'
    });
    
    var input = document.getElementById('map-search');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
    
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } 
            else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    
    infoWindow = new google.maps.InfoWindow;
    var pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: 'Me!'
            });
            map.setCenter(pos);
            
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

document.getElementById("events-tab").addEventListener("click", function(){
    document.getElementById("promotions-tab").classList.add("hide-tab");
    this.classList.remove("hide-tab");
    document.getElementById("events-container").style.display = "block";
    document.getElementById("promotions-container").style.display = "none";
}); 

document.getElementById("promotions-tab").addEventListener("click", function(){
    document.getElementById("events-tab").classList.add("hide-tab");
    this.classList.remove("hide-tab");
    document.getElementById("promotions-container").style.display = "block";
    document.getElementById("events-container").style.display = "none";
}); 

(function(){
    
    document.getElementById("nav-items-container").style.display = "none";
    
    window.onload = function() {
        var user = api.getUserName();
        console.log(user);
        if (user != "") {
            document.getElementById("profile-name").innerHTML = user;
        } 
        
        document.getElementById("nav-button").addEventListener("click", function(){
            var cl = this.classList;
            console.log(cl);
            if (cl.length > 1) {
                console.log("mobile on");
                this.classList.remove("hide-items");
                document.getElementById("nav-items-container").style.display = "flex";
            }
            else {
                this.classList.add("hide-items");
                document.getElementById("nav-items-container").style.display = "none"; 
            }
        });
    }
    
}());

