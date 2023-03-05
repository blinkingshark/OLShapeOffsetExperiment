import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geojson from 'geojson';

// create a new style for the vector features with a red fill and black stroke
const defaultStyle = {
  fillColor: 'rgba(22, 22, 22, 0.1)',
  color: 'black',
  weight: 1,
};

// create a new hover style for the vector features
const hoverStyle = {
  fillColor: 'rgba(255, 0, 0, 0.6)',
  color: 'red',
  weight: 1,
};

const reverseStyle = {
  fillColor: 'rgba(22, 22, 22, 0.1)',
  color: 'black',
  weight: 1,
};

// create a new vector layer for the source
const vectorLayer = L.geoJson(null, {
  style: defaultStyle,
  updateWhileAnimating: false,
  updateWhileInteracting: false,
  onEachFeature: function (feature, layer) {
    layer.on('click', function (evt) {
      // remove the highlight
      vectorLayer.eachLayer(function (layer) {
        layer.setStyle(reverseStyle);
      });

      // highlight the currently clicked feature
      layer.setStyle(hoverStyle);
    });
  },
});

// create a new map
const map = L.map('map', {
  // set the center and zoom level
  center: [0, 0],
  zoom: 2,
});

// add an OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// add the vector layer
fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
  .then(response => response.json())
  .then(data => {
    vectorLayer.addData(data);
    map.fitBounds(vectorLayer.getBounds());
  })
  .catch(error => console.error(error));
  
// display the map in a div with id="map"
map.setView('map');