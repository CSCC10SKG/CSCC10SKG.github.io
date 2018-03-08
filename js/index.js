// script generated from google API
var map, infoWindow, geocoder, currentLoc;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.6565353, lng: -79.6010328},
        zoom: 11,
        gestureHandling: 'greedy'
    });
    
    geocoder = new google.maps.Geocoder();
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
            console.log(place);
            currentLoc = place.formatted_address.split(",")[0];
            updateEventLoc();

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
            getLocation(pos.lat, pos.lng);
            
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function getLocation(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode( { 'location': latlng}, function(results, status) {
        if (status == 'OK') {
            currentLoc = results[0].formatted_address.split(",")[0];
            updateEventLoc();
        } else {
            return "unknow Location";
        }
    });
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

function updateEventLoc() {
    var events = document.querySelectorAll(".event");
    events.forEach(function(e){
        var id = e.id;
        e.childNodes[3].innerHTML = currentLoc;
    });
}

(function(){
    
    document.getElementById("nav-items-container").style.display = "none";
    
    window.onload = function() {
        var user = api.getUserName();
        console.log(user);
        if (user != "") {
            document.getElementById("profile-name").innerHTML = user.toUpperCase();
            document.getElementById("mobile-profile-name").innerHTML = user.toUpperCase();
        } 
        
        document.getElementById("nav-button").addEventListener("click", function(){
            var cl = this.classList;
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
		
        var refresh = function () {
        	var events = document.querySelectorAll(".event");
			events.forEach(function(e){
				if (e.id != "addevent") {
					var id = e.id;
					e.addEventListener("click", function(){
						var title = this.childNodes[1].innerHTML;
						var desc = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
						var loc = currentLoc;
						document.getElementById("map-container").style.display = "none";
						document.getElementById("side-container").style.display = "none";
						document.getElementById("event-details-container").style.display = "flex";
						document.getElementById("event-title").innerHTML = title + "   |   " + loc;
						document.getElementById("event-pic").style.background = "url(https://lorempixel.com/400/200/)";
						document.getElementById("event-pic").style.backgroundPosition = "center";
						document.getElementById("event-pic").style.backgroundRepeat = "no-repeat";
						document.getElementById("event-description").innerHTML = desc;
						document.getElementById("feed").innerHTML = "";
						var interval = setInterval(function(){setFeed();}, 2500);
						document.getElementById("feed").scrollTop = document.getElementById("feed").scrollHeight;
						document.getElementById("event-link").addEventListener("click", function(){
							clearInterval(interval);
							document.getElementById("map-container").style.display = "flex";
							document.getElementById("side-container").style.display = "flex";
							document.getElementById("event-details-container").style.display = "none";
						});
					});
				}
        })};
		
		var func = function (){
			console.log("Hello");
		}
		refresh();
		
        document.getElementById("feed-enter").addEventListener("click", function(){
           postFeed(user);
        });
        document.getElementById("feed-input").addEventListener("keypress", function(e){
            var key = e.which || e.keyCode;
            if (key === 13) {
                postFeed(user);
            }
        });
    }
    
    function setFeed(counter=0) {
        var randomMsg = api.getRandomFeedItem();
        var div = document.createElement('div');
        div.classList.add("feed-item");
        div.innerHTML = `<span class="feed-item-name"> ${randomMsg[0]} : </span> ${randomMsg[1]}`;
        document.getElementById("feed").appendChild(div);
        document.getElementById("feed").scrollTop = document.getElementById("feed").scrollHeight;
    }
    
    function setUserMsg(user, msg) {
        var div = document.createElement('div');
        div.classList.add("feed-item");
        div.innerHTML = `<span class="feed-item-name"> ${user} : </span> ${msg}`;
        document.getElementById("feed").appendChild(div);
    }
    
    function setErrorFeed(error) {
        var div = document.createElement('div');
        div.classList.add("feed-item");
        div.style.color = "red";
        div.innerHTML = `<span class="feed-item-name"> ERROR : </span> ${error}`;
        document.getElementById("feed").appendChild(div);
    }
    
    function postFeed(user) {
        if (user != "") {
            var msg = document.getElementById("feed-input").value;
            setUserMsg(user, msg);
            document.getElementById("feed-input").value = "";
        }
        else {
            setErrorFeed("Login to post in the feed.");
        }
        document.getElementById("feed").scrollTop = document.getElementById("feed").scrollHeight;
    }
	
	// Only do things when the document is fully loaded
	var eventadder = document.getElementById("addevent")
	eventadder.addEventListener('click', function (e) {
		e.preventDefault();
		// read from elements
		var container = document.getElementById("side-container");
		eventadder.parentNode.removeChild(eventadder);
		container.innerHTML += `
						<div id="event5" class="event">
                            <div class="event-title">Your New Event</div>
                            <div class="event-location">Comedy Bar</div>
                        </div>
						<div id="addevent" class="event"></div>`;
		func();
		})
}());

