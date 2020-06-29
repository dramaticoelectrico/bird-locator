import styles from './components/Map/map.css';
import { theme } from './components/Map/theme';

let getUrlCoords = function() {
    let temp = {
        lat: 41.8664,
        lng: -87.6154
    };
    let PARAMS = {};
    let params = window.location.search.split('&');
    PARAMS.searchQuery = decodeURIComponent(
        params[0] ? params[0].replace(/\?q=/, '') : ''
    );
    PARAMS.coords = params[1]
        ? {
            lat: Number(params[1].replace(/lat=/, '')),
            lng: Number(params[2].replace(/lng=/, ''))
        }
        : temp;
    PARAMS.bird = decodeURIComponent(
        params[3] ? params[3].replace(/bird=/, '') : '...Unknown Creature'
    );
    return PARAMS;
};
let searchUrl = getUrlCoords();

//PLACES SEARCH
var map;
var service;
var infowindow;
let ICON =
  'data:image/png;base64,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';

var coords = { lat: searchUrl.lat, lng: searchUrl.lng };
initialize(searchUrl.searchQuery);
function initialize() {
    var pyrmont = new google.maps.LatLng(searchUrl.coords);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 14,
        styles: theme
    });

    var request = {
        location: pyrmont,
        radius: '500',
        query: searchUrl.searchQuery
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

function createMarker(item) {
    var infowindow = new google.maps.InfoWindow({
        content: item.name + ' Reported bird ' + searchUrl.bird
    });
    var marker = new google.maps.Marker({
        position: item.geometry.location,
        map: map,
        title: item.name,
        icon: ICON
    });
    marker.addListener('click', function() {
        infowindow.open(marker.get('map'), marker);
    });
}
