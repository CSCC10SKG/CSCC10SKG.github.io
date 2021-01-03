
var user = api.getUserName();
// script generated from google API
var map, infoWindow, geocoder, currentLoc, services, markers;
var currentCords = [43.6628956, -79.3978451];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.6628956, lng: -79.3978451},
        zoom: 11,
        gestureHandling: 'greedy'
    });
    
    geocoder = new google.maps.Geocoder();
    var input = document.getElementById('map-search');
    var searchBox = new google.maps.places.SearchBox(input);
    services = new google.maps.places.PlacesService(map);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('idle', function() {
      searchBox.setBounds(map.getBounds());

    });
    
    markers = [];
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
            currentLoc = place.formatted_address.split(",")[0];
            if (place.geometry.bounds) {
                currentCords = [place.geometry.bounds.f.b, place.geometry.bounds.b.b];
            }
            else {
                currentCords = [place.geometry.viewport.f.b, place.geometry.viewport.b.b];
            }
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
            getLocation(pos.lat, pos.lng, true);
            
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
            updateEventLoc();
        });
    } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function getLocation(lat, lng, update, callback=null) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode( { 'location': latlng}, function(results, status) {
        if (status == 'OK') {
            currentLoc = results[0].formatted_address.split(",")[0];
            console.log("results", results[0]);
            if (results[0].geometry.bounds) {
                currentCords = [results[0].geometry.bounds.f.b, results[0].geometry.bounds.b.b];
            }
            else {
                currentCords = [results[0].geometry.viewport.f.b, results[0].geometry.viewport.b.b];
            }
            if (update) updateEventLoc();
            if (callback) callback(null, currentLoc);
        } else {
            if (callback) callback("unknow loc", null);
            return "unknow Location";
        }
    });
}

function searchLocation(lat, lon, callback) {
    var request = {
        location:  new google.maps.LatLng(lat, lon),
        radius: '30000'
    };
    
    services.nearbySearch(request, callback);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function addInfoBox(infoWindow, pos, message){
    infoWindow.setPosition(pos);
    infoWindow.setContent(message);
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
    searchLocation(currentCords[0], currentCords[1], function(result, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            events.forEach(function(e){
                var index = Math.floor(Math.random() * result.length);
                e.childNodes[3].innerHTML = result[index].vicinity;
                //addInfoBox(new google.maps.InfoWindow, result[index].geometry.location, e.childNodes[1].innerHTML);
                var icon = {
                    url: "../media/pin.png",
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                var marker = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: e.childNodes[1].innerHTML,
                    position: result[index].geometry.location,
                    id: e.id
                });
                marker.addListener("click", function(){
                    var title = document.querySelectorAll("#"+e.id+" .event-title")[0].innerHTML;
                    title += " | " + document.querySelectorAll("#"+e.id+" .event-date")[0].innerHTML;
                    var desc = document.querySelectorAll("#"+e.id+" .event-desc")[0].innerHTML;
                    var fee =  document.querySelectorAll("#"+e.id+" .event-fee")[0].innerHTML;
                    loadEvent(e.id, title, desc, fee);
                });
                markers.push(marker);
            });  
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

function loadEventWithID(id) {
    console.log(id);
    var title = document.querySelectorAll("#"+id+" .event-title")[0].innerHTML;
    title += " | " + document.querySelectorAll("#"+id+" .event-date")[0].innerHTML;
    var desc = document.querySelectorAll("#"+id+" .event-desc")[0].innerHTML;
    var fee =  document.querySelectorAll("#"+id+" .event-fee")[0].innerHTML;
    loadEvent(id, title, desc, fee);
}

function loadEvent(id, title, desc, fee) {
    document.getElementById("event-title").innerHTML = title;
    document.getElementById("event-description").innerHTML = desc;
    document.getElementById("event-fee").innerHTML = fee;            
    document.getElementById("map-container").style.display = "none";
    document.getElementById("side-container").style.display = "none";
    document.getElementById("event-details-container").style.display = "flex";
    document.getElementById("event-pic").style.background = "url(https://lorempixel.com/400/200/)";
    document.getElementById("event-pic").style.backgroundPosition = "center";
    document.getElementById("event-pic").style.backgroundRepeat = "no-repeat";
    document.getElementById("feed").innerHTML = "";
    var interval = setInterval(function(){setFeed();}, 2500);
    document.getElementById("feed").scrollTop = document.getElementById("feed").scrollHeight;
    document.getElementById("event-favorite").addEventListener("click", function(){
        if (user != "") {
            api.addToFavs(user, id, title, desc, fee);
            document.getElementById("alert").innerHTML = "Event added to your Favorites";
            document.getElementById("alert").style.background = "green";
            document.getElementById("alert").classList.add("slideDown");
            setTimeout(function(){
                document.getElementById("alert").classList.remove("slideDown");
            }, 5000);
        } 
        else {
            document.getElementById("alert").innerHTML = "Login to Favorite!";
            document.getElementById("alert").style.background = "red";
            document.getElementById("alert").classList.add("slideDown");
            setTimeout(function(){
                document.getElementById("alert").classList.remove("slideDown");
            }, 5000);
        }
    });
    document.getElementById("event-link").addEventListener("click", function(){
        clearInterval(interval);
        document.getElementById("map-container").style.display = "flex";
        document.getElementById("side-container").style.display = "flex";
        document.getElementById("event-details-container").style.display = "none";
    });
}

(function(){
    
    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        console.log("error", errorMsg, url, lineNumber);
        localStorage.clear();
        document.getElementById("alert").innerHTML = "Error occured! clearing local storage. Page will refresh in 5 seconds";
        document.getElementById("alert").style.background = "red";
        document.getElementById("alert").classList.add("slideDown");
        setTimeout(function(){
            document.getElementById("alert").classList.remove("slideDown");
        }, 5000);
        setTimeout(function(){window.location.href="index.html";},5000);
        return false;
    }

    document.getElementById("nav-items-container").style.display = "none";
    
    window.onload = function() {
        if (user != "") {
            document.getElementById("profile-name").innerHTML = user.toUpperCase();
            document.getElementById("mobile-profile-name").innerHTML = user.toUpperCase();
        } 
        
        document.getElementById("alert").addEventListener("click", function(){
            this.classList.remove("slideDown");
        });
        
        document.getElementById("nav-button").addEventListener("click", function(){
            var cl = this.classList;
            if (cl.length > 1) {
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
                        var title = document.querySelectorAll("#"+e.id+" .event-title")[0].innerHTML;
                        title += " | " + document.querySelectorAll("#"+e.id+" .event-date")[0].innerHTML;
                        var desc = document.querySelectorAll("#"+e.id+" .event-desc")[0].innerHTML;
                        var fee =  document.querySelectorAll("#"+e.id+" .event-fee")[0].innerHTML;
                        loadEvent(e.id, title, desc, fee);
					});
				}
            });
            var extraEvents = api.getEvents();
            if (extraEvents.length > 0) {
                extraEvents.forEach(function(e){
                    var event = document.createElement('div');
                    event.id = e.id;
                    if (e.isPromo) {
                        event.classList.add("event");
                        event.classList.add("promotion");
                        event.innerHTML = `
                            <div class="event-title">${e.name}</div>
                            <div class="event-location"></div>
                            <span class="event-desc">${e.desc}</span>
                            <span class="event-fee"></span>
                            <span class="event-date">${e.date}</span>
                        `;
                        document.getElementById("promotions-container").append(event);
                    }
                    else {
                        event.classList.add("event");
                        event.innerHTML = `
                            <div class="event-title">${e.name}</div>
                            <div class="event-location"></div>
                            <span class="event-desc">${e.desc}</span>
                            <span class="event-fee">${e.fee}</span>
                            <span class="event-date">${e.date}</span>
                        `;
                        document.getElementById("events-container").append(event);
                    }
                    event.addEventListener("click", function(){
                        var data = api.getEvent(e.id);
						var title = data.name;
                        title += " | " + data.date;
                        var desc = data.desc;
                        var fee =  data.fee;
                        loadEvent(e.id, title, desc, fee);
					});
                });
            }
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
        
        if (document.URL.indexOf("#load-event") >= 0) {
            console.log("loading events");
            console.log(document.URL.split("#load-event="));
            loadEventWithID(document.URL.split("#load-event=")[1]);
        }
		
//		// Only do things when the document is fully loaded
//		var eventadder = document.getElementById("addevent");
//		eventadder.addEventListener('click', function (e) {
//		e.preventDefault();
//		// read from elements
//		var container = document.getElementById("events-container");
//		eventadder.parentNode.removeChild(eventadder);
//		container.innerHTML += `
//						<div id="event5" class="event">
//                            <div class="event-title">Your New Event</div>
//                            <div class="event-location">Comedy Bar</div>
//                        </div>
//						<div id="addevent" class="event"></div>`;
//		refresh();
//		});
    }    
}());

