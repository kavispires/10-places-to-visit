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
        // Update currentCity
        var index = self.cityList.indexOf(data);
        self.currentCity(self.cityList()[index]);
        self.currentLocations(self.cityLocations()[index]);
        self.initMap();
        self.currentCityIndex = index;
        // Recolor Markers
        self.recolorFavoriteMarkers(data);
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

    // Create Markers
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

    // Markers Styles
    this.defaultIcon = this.makeMarkerIcon('63bde2');
    this.highlightedIcon = this.makeMarkerIcon('fff');
    this.favoritedIcon = this.makeMarkerIcon('c1272d'); //TODO
    this.markerIcon = ko.observable(self.defaultIcon);

    this.initMap = function() {
        // Clear markers
        self.markers([]);

        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 37.9397,
                lng: -122.5644
            },
            zoom: 6,
            styles: mapStyles, // these styles are gotten from jsMapStyles.js loaded in the html
            mapTypeControl: false
        });

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        
        // Add Markers to markers
        for (var i = 0; i < self.currentLocations().length; i++) {
            var position = self.currentLocations()[i].coord;
            var title = self.currentLocations()[i].title;
            var address = self.currentLocations()[i].address;
            var marker = new google.maps.Marker({
                map: self.map,
                position: position,
                title: title,
                address: address,
                icon: self.markerIcon(),
                animation: google.maps.Animation.DROP,
                index: i,
                favorite: false
            });

            self.markers.push(marker);

            // Marker Listeners
            marker.addListener('click', function() {
                self.populateInfoWindow(this, largeInfowindow);
                // Toggle animation
                self.turnOffMarkerAnimation();
                this.setAnimation(google.maps.Animation.BOUNCE);
            });
            marker.addListener('mouseover', function() {
                self.markerIcon(self.highlightedIcon);
                this.setIcon(self.markerIcon());
                // Highlight list item
                self.currentLocations()[this.index].highlight(true);
            });
            marker.addListener('mouseout', function() {
                // Turns marker back to its original color depending on favorite result
                if(this.favorite) {
                    self.markerIcon(self.favoritedIcon);
                } else {
                    self.markerIcon(self.defaultIcon);
                }
                this.setIcon(self.markerIcon());
                // Un-highlight list item
                self.currentLocations()[this.index].highlight(false);
            });

            bounds.extend(marker.position);
            // Save bounds for all locations
            self.boundsAll = bounds;
            // Update observable for bounds
            self.bounds(bounds);
        }
        self.map.fitBounds(self.bounds());

    };

    // Removes animation of any marker that is bouncing
    this.turnOffMarkerAnimation = function() {
        for (i = 0; i < self.markers().length; i++) {
            if(self.markers()[i].getAnimation() !== null);
            self.markers()[i].setAnimation(null);
        }
    }

    // Add content to infowindow
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            // Clear infowindow
            infowindow.setContent('');
            infowindow.marker = marker;
            // Close infowindow when x is clicked
            infowindow.addListener('closeclick', function() {
                self.turnOffMarkerAnimation();
                infowindow.marker = null;
            });

            // Start contentString
            var contentString = '<div class="info-window">';

            // Add location name
            contentString += '<div class="info"><h3>' + marker.title + '</h3>';

            // Add address p
            contentString += '<p id="address"></p>';

            // Close info div in contentString
            contentString += '</div>';

            // Add pano div
            contentString += '<div id="pano"></div>';

            // Close contentString
            contentString += '</div>'

            infowindow.setContent(contentString);

            // Get Address with Geocoder
            function getGeocoder() {
                var geocoder = new google.maps.Geocoder;
                var pos = marker.position;
                var mi = marker.index;
                var cci = self.currentCityIndex;
                var address = self.cityLocations()[cci][mi].address;
                if (address == '?'){ 
                    geocoder.geocode({'location': pos}, function(results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                address = results[0].formatted_address;
                                writeGeocoder(address, cci, mi);    
                            } else {
                                address = 'Address not available.'; 
                                writeGeocoder(address, cci, mi);  
                            }
                        } else {
                            address = 'Address not available.'; 
                            console.log('Geocoder failed due to: ' + status);
                            writeGeocoder(address, cci, mi); 
                        }
                    });
                } else {
                    writeGeocoder(address, cci, mi);
                }
            };
            
            getGeocoder();

            // This function writes on the infowindow and it's called from inside the geocoder in order to wait for a callback
            function writeGeocoder(address,cci, mi) {
                self.cityLocations()[cci][mi].address = address;
                $('.info-window #address').html(address);
            }

            // Get StreetView on InfoWindow
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;

            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
                } else {
                    contentString += '<div>No Street View Found</div>';
                }
            }

            // Call function
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

            infowindow.open(self.map, marker);
        }
    }

    // Toggle favorite when Heart is clicked
    this.markAsFavorite = function(data) {
        var index = data.index;
        var marker = self.markers()[index];
        if(data.favorite()) {
            data.favorite(false);
            // Recolor marker to default
            self.markerIcon(self.defaultIcon);
        } else {
            data.favorite(true);
            // Recolor marker to red
            self.markerIcon(self.favoritedIcon);
        }
        self.markers()[index].favorite = !self.markers()[index].favorite;
        self.markers()[index].setIcon(self.markerIcon());
        self.calculateBoundsForFavorite();
    }

    // When currentCity is updated, recolor markers
    this.recolorFavoriteMarkers = function() {
        var markers = self.markers();
        var marker;
        var location;
        for (var i = 0; i < markers.length; i++) {
            location = self.cityLocations()[self.currentCityIndex][i];
            marker = markers[i];
            if (location.favorite()) {
                self.markerIcon(self.favoritedIcon);
            } else {
                self.markerIcon(self.defaultIcon);
            }
            self.markers()[i].setIcon(self.markerIcon());
        }
    }

    // Recalculate bounds based of Favorite Locations
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

    // When list-item is clicked, zoom on corresponding marker
    this.focusMarker = function(data) {
        var marker = self.markers()[data.index];
        var latLng = marker.getPosition();
        self.map.setCenter(latLng);
        self.map.setZoom(17);
    }

    // When mouseover list-item, recolor corresponding marker to white (highlitedned icon)
    this.highlightMarkerOn = function(data) {
        self.markerIcon(self.highlightedIcon);
        self.markers()[data.index].setIcon(self.markerIcon());
    }

    // When mouseout list-item, recolor back to default
    this.highlightMarkerOff = function(data) {
        self.markerIcon(self.defaultIcon);
        self.markers()[data.index].setIcon(self.markerIcon());
    }

    this.initMap();
}


function init() {
    ko.applyBindings(new ViewModel());
}