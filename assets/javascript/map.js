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
var marker;
var pos; 

// initialize map centered on CWRU campus
function initMap() {
    var CWRU = { lat: 41.50416, lng: -81.60845 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: CWRU,
        zoom: 16,
        // If mapTypeControl is changed to true, the style:dropdown takes effect with listed id's
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'satellite']
        }
    });
    // directionsDisplay.setMap(map);
    // directionsDisplay.setPanel(document.getElementById('directions-panel'));

    infowindow = new google.maps.InfoWindow();

    geoLocation();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: CWRU,
        radius: 500,
        type: ['parking']
    }, callback);

    /* adds origin/destination inputs, handles route request by travel type  */
    new AutocompleteDirectionsHandler(map);
};

/**
 * @constructor
*/
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);
    this.directionsDisplay.setPanel(document.getElementById('directions'));

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, { placeIdOnly: true });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, { placeIdOnly: true });

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    // ControlPosition.MODIFIERS affect positioning of in-map nav inputs
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(modeSelector);
};

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;
    radioButton.addEventListener('click', function () {
        me.travelMode = mode;
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
        }
        else {
            me.destinationPlaceId = place.place_id;
        }
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.route = function () {
    if (!pos || !this.destinationPlaceId) {
        return;
    }
    var me = this;

    // var request = {
    //     origin: { 'location': pos },
    //     destination: { 'placeId': this.destinationPlaceId },
    //     travelMode: this.travelMode
    // };
    
    // this.directionsService.route(request, function(response, status) {
    //     if (status == google.maps.DirectionsStatus.OK) {
    //         me.directionsDisplay.setDirections(response);
    //     }

    this.directionsService.route({
        origin: { 'location': pos },
        destination: { 'placeId': this.destinationPlaceId },
        travelMode: this.travelMode
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            console.log(response);
            me.directionsDisplay.setDirections(response);
    //         // textDirections();

        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};

//Directions Function BROKENNNNNN
// function textDirections() {
//     if (!this.originPlaceId || !this.destinationPlaceId) {
//         return;
//     }
//     var me = this;

//     this.directionsService.route({
//         origin: { 'placeId': this.originPlaceId },
//         destination: { 'placeId': this.destinationPlaceId },
//         travelMode: this.travelMode
//     });
//     directionsSerivce.route(request, function (response, status) {
//         if (status == google.maps.DirectionsStatus.OK) {
//             debugger;

//             var result = document.getElementById('directions');
//             result.innerHTML = "";
//             for (var i = 0; i < response.routes[0].legs[0].steps.length; i++); {
//                 result.innerHTML += response.routes[0].legs[0].steps[i].instructions + "<br>"
//             }
//             console.log(response);
//             console.log(textDirections);
//             me.directionsDisplay.setDirections(response);

//         }
//         else {
//             window.alert('Directions request failed due to ' + status);
//         };
//     });
// }


function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
        // update map with all posts from Firebase?
        database.ref('Posts').on('child_added', function (snap) {

            // each child/post in database
            var currentPost = snap.val();

        });
    }
};

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc,
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
};

function geoLocation() {
    infoWindow = new google.maps.InfoWindow;

    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            console.log(pos);

            var markerHere = new google.maps.Marker({
                map: map,
                position: pos,
            });

            google.maps.event.addListener(markerHere, 'click', function () {
                infoWindow.setPosition(pos);
                infoWindow.setContent('You are here.');
                infoWindow.open(map);
                map.setCenter(pos);
            });
            // infoWindow.setPosition(pos);
            // infoWindow.setContent('You are here.');
            // infoWindow.open(map);
            // map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        "Error: You must allow Geolocation for directions. <button id='geobutton'>Enable Geolocation</button>" :
        "Error: Your browser doesn\'t support geolocation.");
    infoWindow.open(map);

    $(document).on("click", "#geobutton", function () {
        console.log("button clicked");
        geoLocation();
        infoWindow.close();
    });
};

//This pulls the data-values from the drop down menu
$("#build").on("change", function dropDownDestination(){
    let location = $(":selected", this).data("value"); 
    console.log(location);
});