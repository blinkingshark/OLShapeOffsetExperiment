import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import { Feature } from 'ol';
import { Geometry, GeometryCollection, LineString, MultiLineString, Polygon } from 'ol/geom';

// create a new vector source for the GeoJSON data
const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
});

// create a new style for the vector features with a red fill and black stroke
const defaultStyle = new Style({
  fill: new Fill({
    color: 'rgba(22, 22, 22, 0.1)',
  }),
  stroke: new Stroke({
    color: 'black',
    width: 1,
  }),
});

// Main logic for 3D looking effect, can improve a lot..!
const hoverStyle = new Style({
  geometry: function(feature) {
    const geometry = feature.getGeometry(); // create a copy of the original geometry
    const offset = 200000;
    const translated = feature.get('translated');
    if (geometry instanceof Geometry && !translated && feature instanceof Feature) {
      geometry.translate(0, offset);
      feature.set('translated', true);
    }
    const collection = new GeometryCollection([geometry as Geometry]);
    return collection;
  },
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.6)',
  }),
  stroke: new Stroke({
    color: 'red',
    width: 1,
  }),
});

const reverseStyle = new Style({
  geometry: function(feature) {
    const geometry = feature.getGeometry(); // create a copy of the original geometry
    const offset = -200000;
    const translated = feature.get('translated');
    if (geometry instanceof Geometry && translated && feature instanceof Feature) {
      geometry.translate(0, offset);
      feature.set('translated', false);
    }
    const collection = new GeometryCollection([geometry as Geometry]);
    return collection;
  },
  fill: new Fill({
    color: 'rgba(22, 22, 22, 0.1)',
  }),
  stroke: new Stroke({
    color: 'black',
    width: 1,
  }),
});

// create a new vector layer for the source
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: defaultStyle, 
  updateWhileAnimating: false,
  updateWhileInteracting: false,// set the default style for the vector features
});

// create a new map
const map = new Map({
  target: 'map',
  layers: [
    // add an OpenStreetMap layer
    new TileLayer({
      source: new OSM(),
    }),
    // add the vector layer
    vectorLayer,
  ],
  view: new View({
    // set the center and zoom level
    center: [0, 0],
    zoom: 2,
  }),
});

// display the map in a div with id="map"
map.setTarget('map');

// add a pointermove listener to the map
map.on('click', function (evt) {
  const hit = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    return feature;
  });

  // remove the highlight
  vectorLayer?.getSource()?.forEachFeature(function (feature) {
    feature.setStyle(reverseStyle);
  });

  // highlight the currently hovered feature
  if (hit instanceof Feature) {
    hit.setStyle(hoverStyle);
  }
});
