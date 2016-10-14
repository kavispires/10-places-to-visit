var ViewModel = function() {
    var self = this;

    // Hamburger Menus for Small Screens
    this.toggleNavigationMenu = ko.observable();
    this.toggleFloaterWindow = ko.observable();
    var windowWidth = $(window).width();
    if (windowWidth < 680) {
        this.toggleNavigationMenu(false);
        this.toggleFloaterWindow(false);
    } else {
        this.toggleNavigationMenu(true);
        this.toggleFloaterWindow(true);
    }

    this.cityList = ko.observableArray([]); // Contains just the city names
    this.cityLocations = ko.observableArray([]); // Contains arrays with the city locations objects

    // Populate cityList with city names from database
    // Also, populate cityLocations with objects for each city [city[locations{}]] from database
    for (var key in database) {
        this.cityList.push(key);
        var cityArr = [];
        if (database.hasOwnProperty(key)) {
            for (var i = 0; i < database[key].length; i++) {
                cityArr.push(database[key][i]);
            }
        }
        this.cityLocations.push(cityArr);
    }

    // Determine current City and Locations
    this.currentCityIndex = 0;
    this.currentCity = ko.observable(this.cityList()[this.currentCityIndex]);
    this.currentLocations = ko.observableArray(this.cityLocations()[this.currentCityIndex]);

    // .nav-item click updates currentCity and cuttentLocations
    this.updateCurrentCity = function(data) {
        var index = self.cityList.indexOf(data);
        self.currentCity(self.cityList()[index]);
        self.currentLocations(self.cityLocations()[index]);
        self.initMap();
        self.currentCityIndex = index;
    }

    // Show Favotires/Show All Locations
    this.favoriteStatus = ko.observable(false);
    this.toggleFavoriteLink = ko.observable('Filter Favorites Only');
    this.toggleFavorite = function(data) {
        var status = self.favoriteStatus();
        if (status) {
            self.favoriteStatus(false);
            self.toggleFavoriteLink('Filter Favorites Only');
            // Fit Bounds to All Bounds
            self.bounds(self.boundsAll);
        } else {
            self.favoriteStatus(true);
            self.toggleFavoriteLink('List All Locations');
            // Fit Bounds to Favorite Bounds if any location has been favorited ONLY
            if (self.boundsFavorites) {
                self.bounds(self.boundsFavorites);
            }          
        }
        self.map.setZoom(12);
        self.map.fitBounds(self.bounds());
    }

    // Toggle Markers
    this.toggleMarkersLink = ko.observable('Hide all markers');
    this.toggleMarkers = function(data) {
        var active = self.toggleMarkersLink()
        if (active == "Hide all markers") {
            self.toggleMarkersLink('Show all markers');
            // Hide all markers
            for (var i = 0; i < self.markers().length; i++) {
                self.markers()[i].setMap(null);
            }

        } else {
            self.toggleMarkersLink('Hide all markers');
            // Show all markers
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < self.markers().length; i++) {
                self.markers()[i].setMap(self.map);
                bounds.extend(self.markers()[i].position);
            }
            self.map.fitBounds(bounds);
        }
    }

    // Inicialize Map
    this.map = ko.observable();
    this.markers = ko.observableArray([]);
    this.bounds = ko.observable();
    this.boundsAll;
    this.boundsFavorites;

    this.initMap = function() {
        // Clear markers
        self.markers([]);

        // Copy styles from jsMapStyles.js
        var styles = mapStyles;

        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 37.9397,
                lng: -122.5644
            },
            zoom: 6,
            styles: styles,
            mapTypeControl: false
        });

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        // Markers style
        var defaultIcon = this.makeMarkerIcon('63bde2');
        var highlightedIcon = this.makeMarkerIcon('fff');
        var favoritedIcon = this.makeMarkerIcon('c1272d'); //TODO
        this.markerIcon = ko.observable(defaultIcon);


        for (var i = 0; i < self.currentLocations().length; i++) {
            var position = self.currentLocations()[i].coord;
            var title = self.currentLocations()[i].title;
            var marker = new google.maps.Marker({
                map: self.map,
                position: position,
                title: title,
                icon: this.markerIcon(),
                animation: google.maps.Animation.DROP,
                id: i,
            });

            self.markers.push(marker);

            // Marker Listeners
            marker.addListener('click', function() {
                self.populateInfoWindow(this, largeInfowindow);
                // TODO: highlight location list item
            });
            marker.addListener('mouseover', function() {
                self.markerIcon(highlightedIcon);
                this.setIcon(self.markerIcon());
                // Highlight list item
                self.currentLocations()[this.id].highlight(true);
            });
            marker.addListener('mouseout', function() {
                self.markerIcon(defaultIcon);
                this.setIcon(self.markerIcon());
                // Un-highlight list item
                self.currentLocations()[this.id].highlight(false);
            });

            bounds.extend(marker.position);
            // Save bounds for all locations
            self.boundsAll = bounds;
            // Update observable for bounds
            self.bounds(bounds);
        }
        self.map.fitBounds(self.bounds());

    };

    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            // Clear infowindow
            infowindow.setContent('');
            infowindow.marker = marker;
            // Close infowindow when x is clicked
            infowindow.addListener('cloceclick', function() {
                infowindow.setMarker(null);
            });

            // Get StreetView on InfoWindow
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;

            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div class="info-window"><h3>' + marker.title + '</h3></div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div class="info-window"><h3>' + marker.title + '</h3></div><div>No Street View Found</div>');
                }
            }

            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

            infowindow.open(self.map, marker);
        }
    }

    this.makeMarkerIcon = function(color) {
        var markerImage = {
            url: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + color,
            size: new google.maps.Size(21, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 34),
            scaledSize: new google.maps.Size(21, 34)
        };
        return markerImage;
    }

    // Toggle favorite when Heart is clicked
    this.markAsFavorite = function(data) {
        var index = data.id;
        var marker = self.markers()[index];
        console.log(index);
        console.log(marker);
        if(data.favorite()) {
            data.favorite(false);
            // Recolor marker to default

            // Update BoundsFavorite

        } else {
            data.favorite(true);
            // Recolor marker to red

            // Update BoundsFavorite

        }
        self.calculateBoundsForFavorite();
        console.log(data.favorite());
    }

    this.calculateBoundsForFavorite = function() {
        // Loop through all Locations
        // If favorite is true, add to bounds
        // Update observable
        var boundsfav = new google.maps.LatLngBounds();
        var locations = self.currentLocations();
        var markers = self.markers();
        for(var i = 0; i < locations.length; i++) {
            if(locations[i].favorite()){
                boundsfav.extend(markers[i].position);              
            }
        }
        self.boundsFavorites = boundsfav;
    }

    this.focusMarker = function (data) {
        var marker = self.markers()[data.id];
        var latLng = marker.getPosition();
        self.map.setCenter(latLng);
        self.map.setZoom(15);
    }

    this.initMap();
}


function init() {
    ko.applyBindings(new ViewModel());
}