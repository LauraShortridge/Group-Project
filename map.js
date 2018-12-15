// Initialize Firebase - Laura's DB

        var config = {
            apiKey: "AIzaSyAGsOIG2ma11uu5Ws31bXFUm5j1Q6eG_RA",
            authDomain: "group-project-1-d9dab.firebaseapp.com",
            databaseURL: "https://group-project-1-d9dab.firebaseio.com",
            projectId: "group-project-1-d9dab",
            storageBucket: "",
            messagingSenderId: "3979958216"
        };
        firebase.initializeApp(config);

        // global variables
        var database = firebase.database();
        var map;
        var lat, lng;
        var infowindow;
        var CWRU = { lat: 41.50416, lng: -81.60845 };
        var geocoder;

        // initialize map centered on CWRU campus
        function initMap() {
            var CWRU = { lat: 41.50416, lng: -81.60845 };

            map = new google.maps.Map(document.getElementById('map'), {
                center: CWRU,
                zoom: 16
            });

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: CWRU,
                radius: 500,
                type: ['parking']
            }, callback);
        }

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }
        /* catch geolocation or user input for address
        var address = window.location.search.substr(10);
        geocoder = new google.maps.Geocoder();

        // converts user input address to lat lng coordinates
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                //we call the functions inside the results object in order to get the lat and long.
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                // geocode failed to find position
            }
        }); */

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        })

        
        // update map with all posts from Firebase?
        database.ref('Posts').on('child_added', function (snap) {

            // each child/post in database
            var currentPost = snap.val();

        });