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
var directionsService;
var directionsDisplay;
var travelMode;
var pos;
var locations;
var destinationPlaceId;
// Ridiculous places and latitude and longitude array
var CWRUPlaces = [
    {
        lat: 41.5021734,
        log: -81.604849,
        building: "Veale Parking Lot"
    },
    {
        lat: 41.50298112469461, 
        log: -81.60698175430299,
        building: "A.W. Smith Building"
    },
    {
        lat: 41.503089597822516,
        log: -81.60592496395113,
        building: "Adelbert Gymnasium"
    },
    {
        lat: 41.50471265551692,
        log: -81.60840868949892,
        building: "Adelbert Hall"
    },
    {
        lat: 41.50491352616486,
        log: -81.6091811656952,
        building: "Amasa Stone Chapel"
    },
    {
        lat: 41.50240259827691,
        log: -81.60668134689332,
        building: "Bingham Building"
    },
    {
        lat: 41.50393728897088,
        log: -81.60664379596712,
        building: "Clapp Hall"
    },
    {
        lat: 41.50896294551319,
        log: -81.6075772047043,
        building: "Clark Hall"
    },
    {
        lat: 41.50447964478463,
        log: -81.60968542099,
        building: "Crawford Hall"
    },
    {
        lat: 41.50419440636742,
        log: -81.60697638988496,
        building: "DeGrace Hall"
    },
    {
        lat: 41.50397746363138,
        log: -81.60784006118776,
        building: "Eldred Hall"
    },
    {
        lat: 41.50166738016322,
        log: -81.60712122917177,
        building: "Glennan Bldg"
    },
    {
        lat: 41.50861345204387,
        log: -81.60819411277772,
        building: "Guilford Hall"
    },
    {
        lat: 41.50923209437027,
        log: -81.60750746726991,
        building: "Harkness Chapel"
    },
    {
        lat: 41.50858934897642,
        log: -81.60759866237642,
        building: "Haydn Hall"
    },
    {
        lat: 41.5040618303373,
        log: -81.6069120168686,
        building: "Hovorka Atrium"
    },
    {
        lat: 41.503274403473775,
        log: -81.60659551620485,
        building: "K.H. Smith Building"
    },
    {
        lat: 41.507283752750105,
        log: -81.6093957424164,
        building: "Kelvin Smith Library"
    },
    {
        lat: 41.508235836289835,
        log: -81.60806000232697,
        building: "Mather Dance Studio"
    },
    {
        lat: 41.50794257998277,
        log: -81.60786688327791,
        building: "Mather House"
    },
    {
        lat: 41.50412610965854,
        log: -81.60749673843385,
        building: "Mills Science Center"
    },
    {
        lat: 41.50366410061837,
        log: -81.60731971263887,
        building: "Morley Chemistry Lab"
    },
    {
        lat: 41.50259142343977,
        log: -81.6077756881714,
        building: "Nord Hall"
    },
    {
        lat: 41.50224591314932,
        log: -81.6077220439911,
        building: "Olin Building"
    },
    {
        lat: 41.50298514222111,
        log: -81.60554945468904,
        building: "One to One Fitness Center"
    },
    {
        lat: 41.50357571590462,
        log: -81.60795271396638,
        building: "Rockefeller Building"
    },
    {
        lat: 41.50373239781453,
        log: -81.60693347454072,
        building: "Schmitt Auditorium"
    },
    {
        lat: 41.505291161296,
        log: -81.60316228866579,
        building: "School of Dental Medicine"
    },
    {
        lat: 41.5102564566525,
        log: -81.6088378429413,
        building: "School of Law"
    },
    {
        lat: 41.50994312402801,
        log: -81.60801708698274,
        building: "School of Management"
    },
    {
        lat: 41.504302877462855,
        log: -81.60490036010744,
        building: "School of Medicine"
    },
    {
        lat: 41.50282444096684,
        log: -81.60802245140077,
        building: "Sears Hall"
    },
    {
        lat: 41.50614685828384,
        log: -81.60952985286714,
        building: "Severence Hall"
    },
    {
        lat: 41.50739221867014,
        log: -81.60834431648256,
        building: "Thwing Center"
    },
    {
        lat: 41.508079165277344,
        log: -81.60864472389223,
        building: "Tinkham Veale Center"
    },
    {
        lat: 41.50411003983422,
        log: -81.60954594612123,
        building: "Tomlinson Hall"
    },
    {
        lat: 41.51003551713903,
        log: -81.60420835018158,
        building: "University Book Store"
    },
    {
        lat: 41.50112901843625,
        log: -81.60615563392639,
        building: "Veale Rec Center"
    },
    {
        lat: 41.501988788015815,
        log: -81.6074323654175,
        building: "White Building"
    },    
    {
        lat: 41.50302531747237,
        log: -81.6082799434662,
        building: "Wickenden Building"
    },
    {
        lat: 41.50361990827657,
        log: -81.60892367362976,
        building: "Yost Hall"
    }
];

// Initializing our map
function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        center: CWRU,
        zoom: 15,
        // If mapTypeControl is changed to true, the style:dropdown takes effect with listed id's
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'satellite']
        }
    });

    travelMode = 'WALKING';
    var destinationInput = document.getElementById('build');
    var modeSelector = document.getElementById('mode-selector');

    setupClickListener('changemode-walking', 'WALKING');
    setupClickListener('changemode-transit', 'TRANSIT');
    setupClickListener('changemode-driving', 'DRIVING');

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(modeSelector);

    infowindow = new google.maps.InfoWindow();

    geoLocation();

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));
};
  
// Our function to calculate and display our route from origin to destination
function calcRoute() {
    var start = pos;
    var end = destinationPlaceId;
    var request = {
      origin:start,
      destination:end,
      travelMode: travelMode
    };
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
};

// Click listener for our radio travel mode buttons
function setupClickListener (id, mode) {
    var radioButton = document.getElementById(id);
    // var me = this;
    radioButton.addEventListener('click', function () {
        travelMode = mode;
        calcRoute();
    });
};

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

// Function to identify the users location
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

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};

// Function to tell the user to allow geoLocation or the routing function won't work correctly
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

// This pulls the data-values from the drop down menu
$("#build").on("change", function(event) {
    event.preventDefault();
    var locations = $(":selected", this).attr("data-value");
    console.log(locations);
    var item = CWRUPlaces.find(item => item.building === locations);
    console.log(item);
    destinationPlaceId = {
        lat: item.lat,
        lng: item.log
    };
    console.log(destinationPlaceId);
    calcRoute();
});

  