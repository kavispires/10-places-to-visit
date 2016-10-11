var model = {}

model = data;

var ViewModel = function(){
    this.currentCity = ko.observable('San Francisco');
    this.locations = ko.observableArray(data['san francisco']);
}

ko.applyBindings(new ViewModel());















var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

}






$('.icon-map').on('click', function(){
  $('nav').slideToggle('fast');
});

$('.icon-popup').on('click', function(){
  $('.floater').slideToggle('fast');
});